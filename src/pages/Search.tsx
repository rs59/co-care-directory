import React, { useEffect, useState } from "react";

import { CardGroup, Grid, GridContainer } from "@trussworks/react-uswds";

import { getMatchingCare, parseSearchParams } from "../util";

import ResultCard from "../components/ResultCard";

import CARE_PROVIDER_DATA from "../data/ladders_data.json";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CareProvider, SearchResult } from "../types";

// TODO: add ui for radius
const DEFAULT_RADIUS = 8047; // 5 miles in meters
const MAX_RESULTS = 50; // TODO: figure out how to limit results if there are too many

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = parseSearchParams(searchParams);

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

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

  return (
    <div className="Search">
      {searchResult && (
        <GridContainer>
          <Grid row>
            <div className="padding-top-0">
              <h1>Results near {params.zip}</h1>
              [TODO: add filters here]
            </div>
          </Grid>
          <Grid row>
            {searchResult.error ? (
              <p className="text-error">{searchResult.error}</p>
            ) : (
              <CardGroup>
                {searchResult.results.slice(0, MAX_RESULTS).map((result) => (
                  <ResultCard data={result} key={result.id} />
                ))}
              </CardGroup>
            )}
          </Grid>
        </GridContainer>
      )}
    </div>
  );
}

export default Search;
