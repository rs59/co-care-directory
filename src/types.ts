export type DailyHours =
  | {
      open: true;
      start: string;
      end: string;
    }
  | { open: false };

export type WeeklyHours = {
  sunday: DailyHours;
  monday: DailyHours;
  tuesday: DailyHours;
  wednesday: DailyHours;
  thursday: DailyHours;
  friday: DailyHours;
  saturday: DailyHours;
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
  hours: WeeklyHours;
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

export type SearchFilters = {
  zip: string;
  miles: number;
};
