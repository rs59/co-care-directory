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
  TypeOfHelp,
  ZipCenterLookup,
} from "./types";
import zipToLatLong from "./data/colorado_zip_latlong.json";

export const DEFAULT_RADIUS_MILES = 10;

export const METERS_IN_A_MILE = 1609.34;

export const MILE_DISTANCE_OPTIONS = [10, 25, 50, 100];

export const getZipCenter = (zip: string): LatLngLiteral | null =>
  (zipToLatLong as ZipCenterLookup)[zip] || null;

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

// TODO: figure out how to limit results if there are too many
export function getMatchingCare(
  careData: CareProvider[],
  zip: string,
  radiusMiles: number,
  typesOfHelp: TypeOfHelp[] = []
): SearchResult {
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
    .filter((result) => isWithinRadius(result, radiusMiles))
    .filter((result) => offersAnyTypesOfHelpNeeded(result, typesOfHelp))
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
  const milesStr = searchParams.get("miles");
  return {
    zip: searchParams.get("zip") ?? "",
    miles: (milesStr && parseInt(milesStr)) || DEFAULT_RADIUS_MILES,
    // TODO: how to enforce type?
    typesOfHelp: searchParams.getAll("types_of_help") as TypeOfHelp[],
  };
}

export function constructSearchParamsFromFilters(filters: SearchFilters) {
  return {
    zip: filters.zip,
    miles: filters.miles.toString(),
    types_of_help: filters.typesOfHelp,
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
