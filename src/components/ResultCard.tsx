import { Card, CardBody, CardHeader } from "@trussworks/react-uswds";
import { CareResult } from "../data/dummy_ladders_data";

export default function ResultCard({ data }: { data: CareResult }) {
  return (
    <Card headerFirst gridLayout={{ tablet: { col: 4 } }}>
      <CardHeader>
        <h3>{data.name}</h3>
      </CardHeader>

      <CardBody className="padding-top-3">
        <p>{data.address}</p>
      </CardBody>
    </Card>
  );
}
