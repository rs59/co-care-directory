import React, { useEffect, useState } from "react";

import { LatLngLiteral } from "leaflet";

import "@trussworks/react-uswds/lib/uswds.css";
import "@trussworks/react-uswds/lib/index.css";
import {
  Button,
  CardGroup,
  Grid,
  GridContainer,
  Header,
  Title,
  TextInput,
} from "@trussworks/react-uswds";

import "./App.css";

import { CareResult, getMatchingCare } from "./util";

import ResultCard from "./components/ResultCard";

import zipToLatLong from "./data/colorado_zip_latlong.json";
import { CARE_DATA } from "./data/dummy_ladders_data";
import ResultDetail from "./components/ResultDetail";

// TODO: add ui for radius
const DEFAULT_RADIUS = 8047; // 5 miles in meters
const MAX_RESULTS = 50; // TODO: figure out how to limit results if there are too many

function App() {
  const [zip, setZip] = useState<string>("");
  const [center, setCenter] = useState<LatLngLiteral | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CareResult[] | null>(null);
  const [selectedResultDetail, setSelectedResultDetail] =
    useState<CareResult | null>(null);

  useEffect(() => {
    if (center) {
      const results = getMatchingCare(CARE_DATA, center, DEFAULT_RADIUS);
      setResults(results);
    } else {
      setResults(null);
    }
  }, [center]);

  function setSearchFilters(zip: string) {
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
    <div className="App">
      <Header basic color="primary" role="banner">
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>
              <a href="/" title="Home" aria-label="Home">
                Colorado Care Directory Prototype
              </a>
            </Title>
          </div>
        </div>
      </Header>
      <GridContainer>
        {selectedResultDetail !== null ? (
          <Grid row className="padding-top-4">
            <div>
              <Button
                type="button"
                unstyled
                onClick={() => setSelectedResultDetail(null)}
              >
                Back to all results
              </Button>
              <ResultDetail data={selectedResultDetail} />
            </div>
          </Grid>
        ) : (
          <>
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
                      onShowDetail={() => setSelectedResultDetail(result)}
                    ></ResultCard>
                  ))}
            </CardGroup>
          </>
        )}
      </GridContainer>
    </div>
  );
}

export default App;
