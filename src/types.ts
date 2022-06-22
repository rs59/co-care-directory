export type HoursOfOperation = {
  start: string;
  end: string;
} | null;

export type CareProvider = {
  id: string;
  name: string;
  programName: string;
  phone: string;
  hideAddress: boolean;
  address: string[];
  website: string;
  substanceUse: {
    supported: boolean;
    services: string[];
  };
  mentalHealth: {
    supported: boolean;
    services: string[];
  };
  populationsServed: string[];
  hours: {
    sunday: HoursOfOperation;
    monday: HoursOfOperation;
    tuesday: HoursOfOperation;
    wednesday: HoursOfOperation;
    thursday: HoursOfOperation;
    friday: HoursOfOperation;
    saturday: HoursOfOperation;
  };
  accessibility: string[];
  fees: string[];
  latitude: number | null;
  longitude: number | null;
};

export type CareProviderSearchMetadata = { distance?: number };

export type CareProviderSearchResult = CareProvider &
  CareProviderSearchMetadata;

export type SearchResult = {
  results: CareProviderSearchResult[];
  error: string | null;
};

export interface ZipCenterLookup {
  [key: string]: { lat: number; lng: number };
}
