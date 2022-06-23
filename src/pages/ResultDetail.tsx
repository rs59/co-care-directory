import {
  Grid,
  GridContainer,
  Link as ExternalLink,
} from "@trussworks/react-uswds";
import { Marker } from "react-leaflet";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

import { ReactComponent as ArrowLeft } from "../images/arrow-left.svg";
import { ReactComponent as Directions } from "../images/directions.svg";

import Map, { markerIcon } from "../components/Map";
import BasicResultDetail from "../components/ResultDetail/BasicResultDetail";
import CARE_PROVIDER_DATA from "../data/ladders_data.json";
import { CareProvider } from "../types";

function ResultDetail() {
  const location = useLocation();
  const params = useParams();

  // If user navigated from /search results page, they have sent the entity-specific
  // data and the url search params as `prevSearch`
  let { prevSearch, data } = (location.state ?? {}) as {
    prevSearch?: string;
    data?: CareProvider;
  };
  if (!data) {
    // If user navigated via different path, pull entity-specific data from CARE_DATA
    const id = params.resultId;
    data = (CARE_PROVIDER_DATA as CareProvider[]).find(
      (result) => `${result.id}` === id
    ); // look up entity in dataset
  }

  if (!data) {
    return <Navigate replace to="/Whoops" />;
  }

  const latLng =
    data.latitude && data.longitude
      ? { lat: data.latitude, lng: data.longitude }
      : null;

  const googleMapsDirectionsURL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    data.address.join("")
  )}`;

  return (
    <GridContainer className="ResultDetail">
      <Link
        className="display-flex flex-align-center"
        to={`/search${prevSearch ?? ""}`}
      >
        <ArrowLeft className="margin-right-1" />
        Back to search
      </Link>
      <h1>{data.name}</h1>
      <h2 className="usa-sr-only">Basic info</h2>
      <Grid row>
        <Grid tablet={{ col: true }} className="tablet:order-last">
          {latLng && data.address && (
            <div className="display-grid">
              <Map
                mapContainerProps={{ center: latLng, zoom: 14 }}
                mapContainerStyles={{ flex: 1, height: "300px" }}
              >
                <Marker
                  icon={markerIcon}
                  position={latLng}
                  interactive={false}
                />
              </Map>

              <ExternalLink
                className="tablet:order-first usa-button usa-button--base text-black margin-right-0 margin-y-1 display-flex flex-align-center flex-justify-center"
                target="#"
                href={googleMapsDirectionsURL}
              >
                <Directions className="margin-right-1" /> Get directions
              </ExternalLink>
            </div>
          )}
        </Grid>
        <Grid tablet={{ col: true }}>
          <BasicResultDetail
            headingLevel="h3"
            result={data}
            directionsURL={googleMapsDirectionsURL}
          />
        </Grid>
      </Grid>
    </GridContainer>
  );
}
export default ResultDetail;
