import { Grid, GridContainer } from "@trussworks/react-uswds";
import { Link, useLocation } from "react-router-dom";

import Address from '../components/Address';
import Map from "../components/Map";
import { CARE_DATA } from '../data/dummy_ladders_data';
import { CareEntity } from '../util';

function ResultDetail() {
  const location = useLocation();

  let navigatedFromSearch = true;
  let data: CareEntity | undefined = location.state as CareEntity ;
  if (!data) {
    navigatedFromSearch = false;
    const id = location.pathname.split('/')[2]; // grab id from url path
    data = CARE_DATA.find((result) => `${result.id}` === id) // look up entity in dataset 
  }
  
  // TODO: create general purpose 404 page 
  if (!data) {
    return (
      <>
        Whoops!
      </>
    )
  }

  const latLng = {lat: data.lat, lng: data.lng};

  // TODO: add hours, languages, services, map
  return (
    <GridContainer>
      {navigatedFromSearch && 
        // Link can accept stack index as `to` prop, but the types don't reflect that
        // so cast to `any` as short-term workaround
        <Link to={-1 as any}>Back to search results</Link> 
      }
      <Grid row>
        <Grid col>
          <h1>{data.name}</h1>
          <Address data={data} />
          {data.phone && <p>{data.phone}</p>}
        </Grid>
      </Grid>
      {(data.zip && data.lat && data.lng) && <Map
        tileLayerProps={{ url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }}
        mapContainerProps={{ center: latLng, zoom: 14 }}
        markerData={{ [data.zip]: latLng }}
      />}
    </GridContainer>
  )
}
export default ResultDetail;