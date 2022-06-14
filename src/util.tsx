import { latLng, LatLngLiteral } from "leaflet";

export type CareEntity = {
  x: number;
  y: number;
  id: number;
  name: string;
  address: string | null;
  city: string;
  state: string | null;
  zip: string | null;
  phone: string | null;
  substance_abuse_services: string | null;
  mental_health_settings: string | null;
  additional_services: string | null;
  languages_spoken: string | null;
  population_served: string | null;
  accessibility: string | null;
  fees: string | null;
  mon: string | null;
  tue: string | null;
  wed: string | null;
  thu: string | null;
  fri: string | null;
  sat: string | null;
  sun: string | null;
  lat: number;
  lng: number;
  county: string;
  date_geocoded: string;
  data_source: string;
  dataset_name: string;
  distance?: number;
};

export function getMatchingCare(
  careData: CareEntity[],
  center: LatLngLiteral,
  radius: number
): CareEntity[] {
  // calculate distance & sort results by distance
  const results = careData
    .map((result) => ({
      ...result,
      distance: latLng(center).distanceTo([result.lat, result.lng]),
    }))
    .sort((a, b) => {
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
  return { urlZip: searchParams.get('zip') ?? "" }
}