import { GridContainer, Grid } from "@trussworks/react-uswds";
import { Link } from 'react-router-dom';

function Whoops() {
  return (
    <GridContainer>
      <Grid row className="flex-justify-center">
        <h1>Whoops!</h1>
      </Grid>
      <Grid row className="flex-justify-center">
        <Link to="/">Return to homepage</Link>
      </Grid>
    </GridContainer>
  )
}

export default Whoops;