import { Link } from "@trussworks/react-uswds";
import { useTranslation } from "react-i18next";

import { ReactComponent as Telephone } from "../../images/phone.svg";
import { ReactComponent as Website } from "../../images/website.svg";
import { ReactComponent as Location } from "../../images/location.svg";
import { ReactComponent as DollarSign } from "../../images/dollar-sign.svg";
import { ReactComponent as Clock } from "../../images/clock.svg";

import ResultDatum from "./ResultDatum";
import Hours from "./Hours";

import { CareProvider } from "../../types";

type BasicResultDetailProps = {
  headingLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  result: CareProvider;
  directionsURL: string;
};

function BasicResultDetail({
  headingLevel,
  result,
  directionsURL,
}: BasicResultDetailProps) {
  const { t } = useTranslation();
  const T_PREFIX = "components.resultDetail.";
  const Heading = headingLevel;

  return (
    <>
      {result.phone && (
        <ResultDatum Icon={Telephone} key="telephone">
          <Heading className="usa-sr-only">
            {t(`${T_PREFIX}telephoneNumber`)}
          </Heading>
          <Link variant="external" href={`tel:${result.phone}`}>
            {result.phone}
          </Link>
        </ResultDatum>
      )}
      {result.website && (
        <ResultDatum Icon={Website} key="website">
          <Heading className="usa-sr-only">{t(`${T_PREFIX}website`)}</Heading>
          <Link
            className="wrap-text"
            variant="external"
            target="#"
            href={encodeURI(result.website)}
          >
            {result.website}
          </Link>
        </ResultDatum>
      )}
      {result.address?.length && (
        <ResultDatum Icon={Location} key="address">
          <Heading className="usa-sr-only">{t(`${T_PREFIX}address`)}</Heading>
          <div>{result.address.join("")}</div>
          <div className="margin-top-1">
            <Link target="#" href={directionsURL}>
              {t(`common.getDirections`)}
            </Link>
          </div>
        </ResultDatum>
      )}
      {!!result.fees?.length && (
        <ResultDatum Icon={DollarSign} key="fees">
          <div>
            <Heading className="font-body-sm display-inline">
              {t(`${T_PREFIX}fees`)}:{" "}
            </Heading>
            {result.fees.join("; ")}
          </div>
          <div className="margin-top-1">TODO: MORE INFO HERE</div>
        </ResultDatum>
      )}
      <ResultDatum Icon={Clock} key="hours">
        <Heading className="font-body-sm display-inline">
          {t(`${T_PREFIX}hours`)}
        </Heading>
        <Hours hours={result.hours} />
      </ResultDatum>
    </>
  );
}

export default BasicResultDetail;
