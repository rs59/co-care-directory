import {
  latLng,
  latLngBounds,
  LatLngExpression,
  LatLngLiteral,
  LatLngTuple,
} from "leaflet";
import {
  CareProvider,
  CareProviderSearchResult,
  SearchFilters,
  SearchResult,
  ZipData,
  TypeOfHelp,
  FeePreference,
} from "./types";
import coloradoZipData from "./data/colorado_zip_data.json";

export const DEFAULT_RADIUS_MILES = 10;

export const METERS_IN_A_MILE = 1609.34;

export const MILE_DISTANCE_OPTIONS = ["10", "25", "50", "100"];

export const getZipCenter = (zip: string): LatLngLiteral | null => {
  const data = (coloradoZipData as ZipData)[zip];
  return data ? { lat: data.centroid_lat, lng: data.centroid_lon } : null;
};

export const addSearchMetadata = (
  careProviders: CareProvider[],
  searchLocation: LatLngExpression
): CareProviderSearchResult[] =>
  careProviders.map((result) => ({
    ...result,
    distance: result.latlng
      ? latLng(searchLocation).distanceTo(result.latlng)
      : undefined,
  }));

export const isWithinRadius = (
  careProvider: CareProviderSearchResult,
  miles: number
): boolean => {
  const radiusMeters = miles * METERS_IN_A_MILE;
  // TODO: figure out how places that don't have location will work w filters
  return !!(careProvider.distance && careProvider.distance <= radiusMeters);
};

export const compareDistance = (
  a: CareProviderSearchResult,
  b: CareProviderSearchResult
): number => {
  if (a.distance === undefined) {
    return 1;
  } else if (b.distance === undefined) {
    return -1;
  }
  return a.distance - b.distance;
};

// TODO: tests
export const offersTypeOfHelp = (
  careProvider: CareProviderSearchResult,
  typeOfHelp: TypeOfHelp
): boolean => {
  switch (typeOfHelp) {
    case TypeOfHelp.SubstanceUse:
      return careProvider.substanceUse.supported;
    case TypeOfHelp.CourtMandatedTreatment:
      return (
        careProvider.substanceUse.duiSupported ||
        careProvider.mentalHealth.services.IntensiveOutpatient
      );
    case TypeOfHelp.MentalHealth:
      return careProvider.mentalHealth.supported;
    case TypeOfHelp.SuicidalIdeation:
      return careProvider.mentalHealth.supported;
    default:
      return false;
  }
};

// TODO: tests
export const offersAnyTypesOfHelpNeeded = (
  careProvider: CareProviderSearchResult,
  helpNeeded: TypeOfHelp[]
): boolean => {
  // if no help types specified, don't apply any filter
  if (!helpNeeded.length) {
    return true;
  }

  // check if provider offers ANY of the types of help needed
  return helpNeeded.some((typeOfHelp) =>
    offersTypeOfHelp(careProvider, typeOfHelp)
  );
};

// TODO: tests
export const meetsFeePreferences = (
  careProvider: CareProviderSearchResult,
  feePreferences: FeePreference[]
): boolean => {
  // if no payment preferences specified, don't apply any filter
  if (!feePreferences.length) {
    return true;
  }

  // check if provider fees match any of preferences
  return feePreferences.some(
    (feePreference) => careProvider.fees[feePreference]
  );
};

// TODO: figure out how to limit results if there are too many
export function getMatchingCare(
  careData: CareProvider[],
  filters: SearchFilters
): SearchResult {
  const { zip, miles: milesStr, typesOfHelp, feePreferences } = filters;
  const miles = parseInt(milesStr);
  if (zip.length !== 5) {
    return {
      results: [],
      error: "Please enter a valid zip code",
    };
  }

  // get zip code center
  const center = getZipCenter(zip);
  if (!center) {
    return {
      results: [],
      error: "This is not a valid zip code in Colorado",
    };
  }

  // calculate distance, apply filters, & sort results by distance
  const results = addSearchMetadata(careData, center)
    .filter((result) => isWithinRadius(result, miles))
    .filter((result) => offersAnyTypesOfHelpNeeded(result, typesOfHelp))
    .filter((result) => meetsFeePreferences(result, feePreferences))
    .sort(compareDistance);

  return { results, error: null };
}

/**
 * Helper function to parse filter values from URL search params
 * @param searchParams
 * @returns Object containing search urls by name
 */
export function getFiltersFromSearchParams(
  searchParams: URLSearchParams
): SearchFilters {
  return {
    zip: searchParams.get("zip") ?? "",
    miles: searchParams.get("miles") ?? `${DEFAULT_RADIUS_MILES}`,
    // TODO: how to enforce type?
    typesOfHelp: searchParams.getAll("typesOfHelp") as TypeOfHelp[],
    feePreferences: searchParams.getAll("fees") as FeePreference[],
  };
}

/**
 * Helper function to get bounds for the search result map
 * based on the returned set of CareProviderSearchResults
 * @param searchResults
 * @returns
 */
export function getResultBounds(searchResults: CareProviderSearchResult[]) {
  return latLngBounds(
    searchResults
      .filter((result) => !!result.latlng)
      .map((result) => result.latlng as LatLngTuple)
  );
}

export function getGoogleMapsDirectionsURL(
  careProvider: CareProviderSearchResult
) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    careProvider.address.join(", ")
  )}`;
}

/**
 * Helper function to check if any properties in the given
 * boolean map are 'true'; used to optionally display chunks
 * of data in UI
 * @param boolMap
 * @returns
 */
export function anyAreTrue(boolMap: { [key: string]: boolean }) {
  return Object.values(boolMap).some((bool) => !!bool);
}

export function toggleItemInList(list: any[], item: any) {
  // remove an item if it's in the list
  // or add it if it isn't
  return list.includes(item)
    ? list.filter((val) => val !== item)
    : [...list, item];
}
