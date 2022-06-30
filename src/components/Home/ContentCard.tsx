import { Card, CardBody, CardHeader } from "@trussworks/react-uswds";
import { ReactNode } from "react";

type ContentCardProps = {
  headerContent: ReactNode;
  bodyContent: ReactNode;
};
function ContentCard({ headerContent, bodyContent }: ContentCardProps) {
  return (
    <Card
      containerProps={{ className: "bg-base-lightest border-0" }}
      gridLayout={{ mobile: { col: 12 }, tablet: { col: 4 } }}
    >
      <CardHeader className="height-15 display-flex flex-justify-center flex-align-center">
        {headerContent}
      </CardHeader>
      <CardBody>{bodyContent}</CardBody>
    </Card>
  );
}

export default ContentCard;
