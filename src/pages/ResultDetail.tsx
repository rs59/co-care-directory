import {
  Grid,
  GridContainer,
  Link as ExternalLink,
} from "@trussworks/react-uswds";
import { Marker } from "react-leaflet";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ReactComponent as ArrowLeft } from "../images/arrow-left.svg";
import { ReactComponent as Directions } from "../images/directions.svg";
import { ReactComponent as Populations } from "../images/populations.svg";
import { ReactComponent as Accessibility } from "../images/accessibility.svg";

import Map, { markerIcon } from "../components/Map";
import BasicResultDetail from "../components/ResultDetail/BasicResultDetail";
import CARE_PROVIDER_DATA from "../data/ladders_data.json";
import { CareProvider, CareProviderSearchResult } from "../types";
import ResultDatum from "../components/ResultDetail/ResultDatum";
import Horizontal from "../components/Horizontal";

function ResultDetail() {
  const { t } = useTranslation();
  const T_PREFIX = "pages.resultDetail.";
  const location = useLocation();
  const params = useParams();

  // If user navigated from /search results page, they have sent the entity-specific
  // data and the url search params as `prevSearch`
  let { prevSearch, data } = (location.state ?? {}) as {
    prevSearch?: string;
    data?: CareProviderSearchResult;
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
    data.address.join(", ")
  )}`;

  return (
    <GridContainer className="ResultDetail">
      <Link
        className="display-flex flex-align-center"
        to={`/search${prevSearch ?? ""}`}
      >
        <ArrowLeft className="margin-right-1" />
        {t(`${T_PREFIX}backToSearch`)}
      </Link>
      <h1>{data.name}</h1>
      <section>
        <h2 className="usa-sr-only">{t(`${T_PREFIX}basicInfo`)}</h2>
        <Grid row className="flex-justify">
          <Grid tablet={{ col: 5 }} className="tablet:order-last">
            {latLng && data.address && (
              <div>
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
                  variant="external"
                  className="usa-button text-black margin-right-0 margin-y-2  display-flex flex-align-center flex-justify-center"
                  target="_blank "
                  href={googleMapsDirectionsURL}
                >
                  <Directions className="margin-right-1" />
                  {t(`common.getDirections`)}
                </ExternalLink>
              </div>
            )}
          </Grid>
          <Grid tablet={{ col: 5 }}>
            <BasicResultDetail
              headingLevel="h3"
              result={data}
              directionsURL={googleMapsDirectionsURL}
            />
          </Grid>
        </Grid>
      </section>
      <section>
        <h2>{t(`${T_PREFIX}details`)}</h2>
        <Horizontal />
        <Grid row>
          <Grid tablet={{ col: 5 }}>
            <ResultDatum Icon={Populations} key="population">
              <div>
                <h3 className="font-body-sm display-inline">
                  {t(`${T_PREFIX}populationsServed`)}:{" "}
                </h3>
                {data.populationsServed.join(", ")}
              </div>
            </ResultDatum>
            <ResultDatum Icon={Accessibility} key="accessibility">
              <div>
                <h3 className="font-body-sm display-inline">
                  {t(`${T_PREFIX}accessibilityOptions`)}:{" "}
                </h3>
                {data.accessibility.join(", ")}
              </div>
            </ResultDatum>
          </Grid>
        </Grid>
      </section>
      {(data.substanceUse.supported || data.mentalHealth.supported) && (
        <section>
          <h2>{t(`${T_PREFIX}specialities`)}</h2>
          <Horizontal />
          {data.substanceUse.supported && (
            <>
              <h3>{t(`${T_PREFIX}substanceUseServices`)}:</h3>
              <ul>
                {data.substanceUse.services.map((service, idx) => (
                  <li key={idx} className="line-height-body-4">
                    {service}
                  </li>
                ))}
              </ul>
            </>
          )}
          {data.mentalHealth.supported && (
            <>
              <h3>{t("mentalHealthServices")}:</h3>
              <ul>
                {data.mentalHealth.services.map((service, idx) => (
                  <li key={idx} className="line-height-body-4">
                    {service}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </GridContainer>
  );
}
export default ResultDetail;
