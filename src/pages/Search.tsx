import React, { useEffect, useState } from "react";

import {
  Button,
  ButtonGroup,
  Grid,
  GridContainer,
} from "@trussworks/react-uswds";

import { getMatchingCare, parseSearchParams } from "../util";

import SearchResultCard from "../components/SearchResultCard";

import CARE_PROVIDER_DATA from "../data/ladders_data.json";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CareProvider, CareProviderSearchResult, SearchResult } from "../types";
import { useTranslation } from "react-i18next";

// TODO: add ui for radius
const DEFAULT_RADIUS = 8047; // 5 miles in meters

const MobileResultsList = ({
  results,
}: {
  results: CareProviderSearchResult[];
}) => (
  <>
    {results.map((result) => (
      <div
        className="border border-base-lighter radius-lg padding-2 margin-bottom-1"
        key={result.id}
      >
        <SearchResultCard data={result} key={result.id} />
      </div>
    ))}
  </>
);

const MobileResultsMap = () => <div>TODO: mobile map</div>;

const DesktopResultsList = ({
  results,
}: {
  results: CareProviderSearchResult[];
}) => (
  <>
    {results.map((result) => (
      <div
        className="border-bottom border-base-lighter padding-y-3"
        key={result.id}
      >
        <SearchResultCard data={result} key={result.id} />
      </div>
    ))}
  </>
);

const DesktopResultsMap = () => <div>TODO: desktop map</div>;

function Search() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = parseSearchParams(searchParams);

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isListView, setIsListView] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    // zip is the only required filter - redirect to homepage if it doesn't exist
    if (!params.zip) {
      navigate("/", {
        replace: true,
      });
    } else {
      const result = getMatchingCare(
        CARE_PROVIDER_DATA as CareProvider[],
        params.zip,
        parseInt(params.miles) || DEFAULT_RADIUS
      );
      setSearchResult(result);
    }
  }, []);

  const mobileViewToggle = (
    <div className="margin-bottom-2">
      <ButtonGroup type="segmented">
        <Button
          type="button"
          outline={!isListView}
          onClick={() => setIsListView(true)}
        >
          List view
        </Button>
        <Button
          type="button"
          outline={isListView}
          onClick={() => setIsListView(false)}
        >
          Map view
        </Button>
      </ButtonGroup>
    </div>
  );

  return (
    <div className="Search">
      {searchResult && (
        <GridContainer>
          <div className="border-bottom border-base-lighter">
            <h1>
              {t("pages.search.heading")} {params.zip}
            </h1>
            <div className="margin-y-2">[TODO: add filters here]</div>
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
                <div className="display-none tablet:display-block">
                  <Grid row className="border-top border-base-lighter">
                    <Grid col={5}>
                      <DesktopResultsList results={searchResult.results} />
                    </Grid>
                    <Grid col={7}>
                      <DesktopResultsMap />
                    </Grid>
                  </Grid>
                </div>

                <div className="tablet:display-none" aria-hidden>
                  {mobileViewToggle}
                  <div className={isListView ? "" : "display-none"}>
                    <MobileResultsList results={searchResult.results} />
                  </div>
                  <div className={isListView ? "display-none" : ""}>
                    <MobileResultsMap />
                  </div>
                </div>
              </>
            )}
          </div>
        </GridContainer>
      )}
    </div>
  );
}

export default Search;
