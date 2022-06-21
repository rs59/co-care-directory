import { latLng, LatLngLiteral } from "leaflet";
import { CareProvider, SearchResult } from "./types";

export function getMatchingCare(
  careData: CareProvider[],
  center: LatLngLiteral,
  radius: number
): SearchResult[] {
  // calculate distance & sort results by distance
  const results = careData
    .map((result) => ({
      ...result,
      distance:
        result.latitude && result.longitude
          ? latLng(center).distanceTo([result.latitude, result.longitude])
          : undefined,
    }))
    .sort((a, b) => {
      if (a.distance === undefined) {
        return 1;
      } else if (b.distance === undefined) {
        return -1;
      }
      return a.distance - b.distance;
    });

  return results;
}

/**
 * Helper function to parse filter values from URL search params
 * @param searchParams
 * @returns Object containing search urls by name
 */
export function parseSearchParams(searchParams: URLSearchParams) {
  return { urlZip: searchParams.get("zip") ?? "" };
}
