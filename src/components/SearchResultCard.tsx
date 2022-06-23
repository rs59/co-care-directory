import { Link, useLocation } from "react-router-dom";

import MilesAway from "./MilesAway";

import { CareProviderSearchResult } from "../types";
import BasicResultDetail from "./ResultDetail/BasicResultDetail";

// TODO: clean up directionsURL
export default function ResultCard({
  data,
}: {
  data: CareProviderSearchResult;
}) {
  const location = useLocation();
  return (
    <div>
      <MilesAway meters={data.distance} />
      <Link
        to={`/result/${data.id}`}
        state={{ prevSearch: location.search, data }}
      >
        <h3 className="usa-card__heading margin-top-1">{data.name}</h3>
      </Link>
      <BasicResultDetail headingLevel="h4" result={data} directionsURL="" />
    </div>
  );
}
