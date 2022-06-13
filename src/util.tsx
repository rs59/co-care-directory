import { latLng, LatLngLiteral } from "leaflet";
import { CareResult } from "./data/dummy_ladders_data";

export function getMatchingCare(
  careData: CareResult[],
  center: LatLngLiteral,
  radius: number
): CareResult[] {
  // filter results by radius and center
  const results = careData.filter(
    (result) =>
      result.lat &&
      result.lng &&
      latLng(center).distanceTo([result.lat, result.lng]) < radius
  );
  return results;
}
