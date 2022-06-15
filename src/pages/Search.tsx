import React, { useEffect, useState } from "react";

import { LatLngLiteral } from "leaflet";

import {
  Button,
  CardGroup,
  Grid,
  GridContainer,
  TextInput,
} from "@trussworks/react-uswds";


import { getMatchingCare, CareEntity, parseSearchParams } from "../util";

import ResultCard from "../components/ResultCard";

import zipToLatLong from "../data/colorado_zip_latlong.json";
import { CARE_DATA } from "../data/dummy_ladders_data";
import { useSearchParams } from "react-router-dom";

// TODO: add ui for radius
const DEFAULT_RADIUS = 8047; // 5 miles in meters
const MAX_RESULTS = 50; // TODO: figure out how to limit results if there are too many

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { urlZip } = parseSearchParams(searchParams);
  const [zip, setZip] = useState<string>(urlZip);

  const [center, setCenter] = useState<LatLngLiteral | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CareEntity[]>([]);

  // Set search filters from URL params on initial page load 
  // to enable returning to filtered result set
  useEffect(() => {
    if(zip) {
      setSearchFilters(zip);
    }
  }, []);

  // Update filtered results based on filter zip center
  useEffect(() => {
    if (center) {
      const results = getMatchingCare(CARE_DATA, center, DEFAULT_RADIUS);
      setResults(results);
    }
  }, [center]);

  // Set search filters from input zip, and update 
  // zip center accordingly  
  function setSearchFilters(zip: string) {

    // Ensure search params match applied filters
    // to enable persistent filtered result set views
    if(zip) setSearchParams({...searchParams, zip });
    
    // @ts-ignore
    const center = zipToLatLong[zip]; // TODO: handle typing
    if (center) {
      setCenter(center);
      setError(null);
    } else {
      setCenter(null);
      setError("This is not a ZIP Code in Colorado");
    }
  }

  // TODO: validate zip
  return (
    <div className="Search">
      <GridContainer>
        <Grid row>
          <div className="padding-top-4">
            <h1>Find care near you</h1>
            <div className="padding-bottom-2">
              <TextInput
                id="zipcode"
                name="zipcode"
                type="text"
                placeholder="ZIP Code"
                maxLength={5}
                value={zip}
                onChange={(evt) => setZip(evt.target.value)}
              />
            </div>
            <Button type="button" onClick={() => setSearchFilters(zip)}>
              Search
            </Button>
          </div>
        </Grid>
        <Grid row>
          <div className="padding-top-4 padding-bottom-4">
            {center && results !== null && (
              <p className="text-primary">
                There are {results.length} results. The center of the radius
                search is {center.lat}, {center.lng}
              </p>
            )}
            {error && <p className="text-error">{error}</p>}
          </div>
        </Grid>
        <CardGroup>
          {results &&
            results
              .slice(0, MAX_RESULTS)
              .map((result) => (
                <ResultCard
                  data={result}
                  key={result.id}
                ></ResultCard>
              ))}
        </CardGroup>
      </GridContainer>
    </div >
  );
}

export default Search;