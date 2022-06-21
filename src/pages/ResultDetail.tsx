import { Grid, GridContainer } from "@trussworks/react-uswds";
import { Marker } from "react-leaflet";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import TileMap, { markerIcon } from "../components/Map";
import CARE_PROVIDER_DATA from "../data/ladders_data.json";
import { CareProvider } from "../types";

function ResultDetail() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  // If user navigated from /search results page, they have sent the entity-specific
  // data and the url search params as `prevSearch`
  let { prevSearch, data } = (location.state ?? {}) as {
    prevSearch?: string;
    data?: CareProvider;
  };
  if (!data) {
    // If user navigated via different path, pull entity-specific data from CARE_DATA
    const id = params.resultId;
    data = CARE_PROVIDER_DATA.find((result) => `${result.id}` === id); // look up entity in dataset
  }

  // TODO: create general purpose 404 page
  if (!data) {
    return <Navigate replace to="/Whoops" />;
  }

  const latLng =
    data.latitude && data.longitude
      ? { lat: data.latitude, lng: data.longitude }
      : null;

  // TODO: add hours, languages, services, map
  return (
    <GridContainer className="ResultDetail">
      <Link to={`/search${prevSearch ?? ""}`}>Back to search</Link>

      <Grid row>
        <Grid col>
          <h1>{data.name}</h1>
          {data.phone && <p>{data.phone}</p>}
        </Grid>
      </Grid>
      {latLng && (
        <TileMap
          tileLayerProps={{
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          }}
          mapContainerProps={{ center: latLng, zoom: 14 }}
        >
          <Marker icon={markerIcon} position={latLng} interactive={false} />
        </TileMap>
      )}
    </GridContainer>
  );
}
export default ResultDetail;
