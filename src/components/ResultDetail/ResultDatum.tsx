import { Grid } from "@trussworks/react-uswds";
import React, { PropsWithChildren } from "react";

type ResultDatumProps = {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

function ResultDatum({ Icon, children }: PropsWithChildren<ResultDatumProps>) {
  return (
    <Grid row className="margin-y-2 flex-align-start">
      <Grid col={1} className="display-flex flex-justify-center">
        <Icon className="data-icon" />
      </Grid>
      <Grid col>{children}</Grid>
    </Grid>
  );
}

export default ResultDatum;
