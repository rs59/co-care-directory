import React from 'react';

import { latLng, LatLngTuple } from 'leaflet';

import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'
import { Header, GridContainer, Grid, Title, Alert } from '@trussworks/react-uswds'

import './App.css';

const CO_CDHS: LatLngTuple= [39.741367, -104.985207];
const CO_CAPITOL: LatLngTuple = [39.739292, -104.984886];

function App() {
  return (
    <div className="App">
      <Header basic>
        <h1>Care Directory</h1>
      </Header>
      <section>
        <Alert headingLevel="h2" type='info' heading="Distance calculated in memory!">
          The distance between the CO Department of Human Services and the CO Capitol building is {latLng(CO_CDHS).distanceTo(CO_CAPITOL)} meters
        </Alert>

        <GridContainer>
          <Title>Responsive columns that stack into rows on small screens</Title>
          <p>and are styled with USWDS utility classes!</p>
          <Grid row>
            <Grid className="bg-red" tablet={{ col: true }}> class name: bg-red</Grid>
            <Grid className="bg-orange" tablet={{ col: true }}> class name: bg-orange</Grid>
            <Grid className="bg-yellow" tablet={{ col: true }}> class name: bg-yellow</Grid>
            <Grid className="bg-green" tablet={{ col: true }}> class name: bg-green</Grid>
            <Grid className="bg-blue" tablet={{ col: true }}> class name: bg-blue</Grid>
          </Grid>
        </GridContainer>
      </section>
    </div>
  );
}

export default App;
