import { Grid, GridContainer } from "@trussworks/react-uswds";
import { Marker } from "react-leaflet";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

import Address from '../components/Address';
import TileMap, { markerIcon } from "../components/Map";
import { CARE_DATA } from '../data/dummy_ladders_data';
import { CareEntity } from '../util';

function ResultDetail() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  // If user navigated from /search results page, they have sent the entity-specific 
  // data and the url search params as `prevSearch`
  let { prevSearch, data } = (location.state ?? {}) as { prevSearch?: string, data?: CareEntity };
  if (!data) {
    // If user navigated via different path, pull entity-specific data from CARE_DATA
    const id = params.resultId;
    data = CARE_DATA.find((result) => `${result.id}` === id) // look up entity in dataset 
  }
  
  // TODO: create general purpose 404 page 
  if (!data) {
    return (
      <Navigate replace to="/Whoops" />
    )
  }

  const latLng = {lat: data.lat, lng: data.lng};

  // TODO: add hours, languages, services, map
  return (
    <GridContainer className="ResultDetail">
      <Link to={`/search${prevSearch ?? ''}`}>Back to search</Link> 
      
      <Grid row>
        <Grid col>
          <h1>{data.name}</h1>
          <Address data={data} />
          {data.phone && <p>{data.phone}</p>}
        </Grid>
      </Grid>
      {(data.zip && data.lat && data.lng) && 
        <TileMap
          tileLayerProps={{ url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }}
          mapContainerProps={{ center: latLng, zoom: 14 }}
        >
          <Marker icon={markerIcon} position={latLng} interactive={false}/>
        </TileMap>
      }
    </GridContainer>
  )
}
export default ResultDetail;