import React, { useEffect, useState, useRef } from "react";

import { Alert, Grid, GridContainer } from "@trussworks/react-uswds";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { LatLngTuple, Map as LeafletMap } from "leaflet";
import { Marker } from "react-leaflet";

import { getMatchingCare, getResultBounds, parseSearchParams } from "../util";
import CARE_PROVIDER_DATA from "../data/ladders_data.json";
import {
  CareProvider,
  CareProviderSearchResult,
  SearchFilters,
  SearchResult,
} from "../types";
import SearchFiltersControl from "../components/Search/FiltersControl";
import ResultCard from "../components/Search/ResultCard";
import ResultsList from "../components/Search/ResultsList";
import ResultsMap, { ResultsMapProps } from "../components/Search/ResultsMap";
import MobileViewToggle, {
  MobileViewToggleProps,
} from "../components/Search/MobileViewToggle";
import { markerIcon } from "../components/Map";

// TODO: add ui for radius
const DEFAULT_RADIUS = 8047; // 5 miles in meters

/**
 * The side-by-side list + map view for desktop or tablet,
 * which is visually hidden in mobile via CSS, but should still
 * be picked up by screen readers
 */
const Desktop = ({ results }: { results: CareProviderSearchResult[] }) => (
  <div className="display-none tablet:display-block">
    <Grid row className="border-top border-base-lighter">
      <Grid
        tablet={{ col: 5 }}
        className="height-viewport overflow-x-hidden"
        key="desktop-list"
      >
        <ResultsList results={results} />
      </Grid>
      <Grid tablet={{ col: 7 }} key="desktop-map">
        <ResultsMap bounds={getResultBounds(results)}>
          {results
            .filter((result) => !!result.latlng)
            .map((result) => (
              <Marker
                position={result.latlng as LatLngTuple}
                icon={markerIcon}
                key={result.id}
              />
            ))}
        </ResultsMap>
      </Grid>
    </Grid>
  </div>
);

/**
 * The toggle-able list + map views for mobile,
 * which are visually hidden in tablet/desktop via CSS
 * and always hidden from screen readers (via aria-hidden=true)
 * to avoid duplication of results lists to screen readers
 */
const Mobile = ({
  isListView,
  onShowMap,
  onShowList,
  mapRef,
  results,
}: MobileViewToggleProps &
  Omit<ResultsMapProps, "bounds"> & {
    results: CareProviderSearchResult[];
  }) => {
  const [selectedResult, setSelectedResult] =
    useState<CareProviderSearchResult>();
  return (
    <div className="tablet:display-none" aria-hidden>
      <MobileViewToggle
        isListView={isListView}
        onShowMap={onShowMap}
        onShowList={onShowList}
      />
      <div className={isListView ? "" : "display-none"} key="mobile-list">
        <ResultsList results={results} isMobile />
      </div>
      <div className={isListView ? "display-none" : ""} key="mobile-map">
        <Alert
          type="info"
          slim
          headingLevel=""
          className="radius-lg margin-y-2"
        >
          Tap a marker to pull up information for that location.
        </Alert>
        <div className="padding-x-2">
          <ResultsMap
            bounds={getResultBounds(results)}
            mapRef={mapRef}
            isMobile
          >
            {results
              .filter((result) => !!result.latlng)
              .map((result) => (
                <Marker
                  title={result.id}
                  position={result.latlng as LatLngTuple}
                  icon={markerIcon}
                  key={result.id}
                  eventHandlers={{
                    click: (e) => {
                      setSelectedResult(
                        results.find((r) => r.id === result.id)
                      );
                    },
                  }}
                />
              ))}
          </ResultsMap>
        </div>
        {selectedResult && (
          <div className="bg-white border border-base-lighter radius-lg padding-2 margin-bottom-1 position-relative top-neg-3 z-top">
            <ResultCard data={selectedResult}>
              <Link className="usa-button" to={`result/${selectedResult.id}`}>
                Full detail about this location
              </Link>
            </ResultCard>
          </div>
        )}
      </div>
    </div>
  );
};

function Search() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = parseSearchParams(searchParams);
  const mapRef = useRef<LeafletMap>(null);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    zip: params.zip,
    miles: parseInt(params.miles) || DEFAULT_RADIUS,
  });
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isListView, setIsListView] = useState<boolean>(true);
  // Leaflet map must be manually re-rendered as a workaround
  // to deal with initial hidden state when map is created
  // OR could just render map view first to avoid this special map manipulation
  const onShowMap = () => {
    setIsListView(false);
    setTimeout(() => {
      mapRef.current?.invalidateSize();
      searchResult &&
        mapRef.current?.fitBounds(getResultBounds(searchResult.results));
    }, 100);
  };

  const navigate = useNavigate();

  const performSearch = (filters: SearchFilters) => {
    // TODO: update args for getMatchingCare to use SearchFilter
    const result = getMatchingCare(
      CARE_PROVIDER_DATA as CareProvider[],
      filters.zip,
      filters.miles
    );
    setSearchResult(result);
  };

  useEffect(() => {
    // zip is the only required filter - redirect to homepage if it doesn't exist
    if (!params.zip) {
      navigate("/", {
        replace: true,
      });
    } else {
      performSearch(searchFilters);
    }
  }, []);

  return (
    <div className="Search">
      {searchResult && (
        <GridContainer>
          <div className="border-bottom border-base-lighter">
            <h1>
              {t("pages.search.heading")} {params.zip}
            </h1>
            <div className="margin-y-2">
              <SearchFiltersControl
                currentFilters={searchFilters}
                onApplyFilters={(filters) => {
                  setSearchFilters(filters);
                  performSearch(filters);
                  // TODO: add helper?
                  setSearchParams({
                    zip: filters.zip,
                    miles: filters.miles.toString(),
                  });
                }}
              />
            </div>
          </div>
          <div>
            {searchResult.error ? (
              <p className="text-error">{searchResult.error}</p>
            ) : (
              <>
                <h2>
                  {searchResult.results.length}{" "}
                  {t("pages.search.resultCount", {
                    count: searchResult.results.length,
                  })}
                </h2>
                <Desktop results={searchResult.results} />
                <Mobile
                  results={searchResult.results}
                  isListView={isListView}
                  onShowList={() => setIsListView(true)}
                  onShowMap={onShowMap}
                  mapRef={mapRef}
                />
              </>
            )}
          </div>
        </GridContainer>
      )}
    </div>
  );
}

export default Search;
