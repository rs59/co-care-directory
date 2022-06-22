import { latLng } from "leaflet";
import { CareProvider, SearchResult, ZipCenterLookup } from "./types";
import zipToLatLong from "./data/colorado_zip_latlong.json";

export const DEFAULT_RADIUS_MILES = 10;

export const METERS_IN_A_MILE = 1609.34;

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
  const center = (zipToLatLong as ZipCenterLookup)[zip];
  if (!center) {
    return {
      results: [],
      error: "This is not a valid zip code in Colorado",
    };
  }

  // calculate distance & sort results by distance
  // TODO: figure out how places that don't have location will work w filters
  const radiusMeters = radiusMiles * METERS_IN_A_MILE;
  const results = careData
    .map((result) => ({
      ...result,
      distance:
        result.latitude && result.longitude
          ? latLng(center).distanceTo([result.latitude, result.longitude])
          : undefined,
    }))
    .filter((result) => !!(result.distance && result.distance <= radiusMeters))
    .sort((a, b) => {
      if (a.distance === undefined) {
        return 1;
      } else if (b.distance === undefined) {
        return -1;
      }
      return a.distance - b.distance;
    });

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
