import { latLng, LatLngLiteral } from "leaflet";
import {
  CareProvider,
  CareProviderSearchResult,
  SearchResult,
  ZipCenterLookup,
} from "./types";
import zipToLatLong from "./data/colorado_zip_latlong.json";

export const DEFAULT_RADIUS_MILES = 10;

export const METERS_IN_A_MILE = 1609.34;

export const getZipCenter = (zip: string): LatLngLiteral | null =>
  (zipToLatLong as ZipCenterLookup)[zip] || null;

const addSearchMetadata = (
  careProviders: CareProvider[],
  searchLocation: LatLngLiteral
): CareProviderSearchResult[] =>
  careProviders.map((result) => ({
    ...result,
    distance:
      result.latitude && result.longitude
        ? latLng(searchLocation).distanceTo([result.latitude, result.longitude])
        : undefined,
  }));

const isWithinRadius = (
  careProvider: CareProviderSearchResult,
  miles: number
): boolean => {
  const radiusMeters = miles * METERS_IN_A_MILE;
  // TODO: figure out how places that don't have location will work w filters
  return !!(careProvider.distance && careProvider.distance <= radiusMeters);
};

const compareDistance = (
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

// TODO: figure out how to limit results if there are too many
export function getMatchingCare(
  careData: CareProvider[],
  zip: string,
  radiusMiles: number
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
    .sort(compareDistance);

  return { results, error: null };
}

/**
 * Helper function to parse filter values from URL search params
 * @param searchParams
 * @returns Object containing search urls by name
 */
export function parseSearchParams(searchParams: URLSearchParams) {
  return {
    zip: searchParams.get("zip") ?? "",
    miles: searchParams.get("miles") ?? "",
  };
}
