import { Link as ExternalLink } from "@trussworks/react-uswds";

import { ReactComponent as Telephone } from '../../images/phone.svg';
import { ReactComponent as Website } from '../../images/website.svg';
import { ReactComponent as Location } from '../../images/location.svg';
import { ReactComponent as DollarSign } from '../../images/dollar-sign.svg';
import { ReactComponent as Clock } from '../../images/clock.svg';


import ResultDatum from "./ResultDatum";
import Hours from "./Hours";

import { CareProvider } from "../../types"

type BasicResultDetailProps = {
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  result: CareProvider;
  directionsURL: string;
}

function BasicResultDetail({ headingLevel, result, directionsURL }: BasicResultDetailProps) {
  const Heading = headingLevel;

  return (
    <>
    {result.phone && (
      <ResultDatum Icon={Telephone}>
        <Heading className="usa-sr-only">Telephone Number</Heading>
        {result.phone}
      </ResultDatum>
    )}  
    {result.website && (
      <ResultDatum Icon={Website}>
        <Heading className="usa-sr-only">Website</Heading>
        <ExternalLink target="#" href={result.website}>{result.website}</ExternalLink>
      </ResultDatum>
    )}  
    {result.address?.length && (
      <ResultDatum Icon={Location}>
        <Heading className="usa-sr-only">Address</Heading>
        <div>{result.address.join('')}</div>
        <div className="margin-top-1">
          <ExternalLink target="#" href={directionsURL}>Get directions</ExternalLink>
        </div>
      </ResultDatum>
    )}
    {result.fees?.length && (
      <ResultDatum Icon={DollarSign}>
        <div><Heading className="font-body-sm display-inline">Fees: </Heading>{result.fees.join('; ')}</div>
        <div className="margin-top-1">TODO: MORE INFO HERE</div>
      </ResultDatum>
    )}
    {result.hours && (
      <ResultDatum Icon={Clock}>
        <Heading className="font-body-sm display-inline">Hours of operation</Heading>
        <Hours hours={result.hours} />
      </ResultDatum>
    )}
    </>
  )
}

export default BasicResultDetail;