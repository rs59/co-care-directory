import { Button, Card, CardBody, CardHeader } from "@trussworks/react-uswds";

import Address from "./Address";
import MilesAway from "./MilesAway";

import { CareResult } from "../util";

export default function ResultCard({
  data,
  onShowDetail,
}: {
  data: CareResult;
  onShowDetail: () => void;
}) {
  return (
    <Card gridLayout={{ tablet: { col: 6 }, desktop: { col: 4 } }}>
      <CardHeader>
        <MilesAway meters={data.distance} />
        <h3 className="usa-card__heading margin-top-1">{data.name}</h3>
      </CardHeader>
      <CardBody>
        <Address data={data} />
        <Button type="button" unstyled onClick={onShowDetail}>
          View details
        </Button>
      </CardBody>
    </Card>
  );
}
