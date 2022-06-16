import { Card, CardBody, CardHeader } from "@trussworks/react-uswds";
import { Link, useLocation } from 'react-router-dom';

import Address from "./Address";
import MilesAway from "./MilesAway";

import { CareEntity } from "../util";

export default function ResultCard({
  data,
}: {
  data: CareEntity 
}) {
  const location = useLocation();
  return (
    <Card gridLayout={{ tablet: { col: 6 }, desktop: { col: 4 } }}>
      <CardHeader>
        <MilesAway meters={data.distance} />
        <Link to={`/result/${data.id}`} state={{ prevSearch: location.search, data }}>
          <h2 className="usa-card__heading margin-top-1">{data.name}</h2>
        </Link>
      </CardHeader>
      <CardBody>
        <Address data={data} />
      </CardBody>
    </Card>
  );
}
