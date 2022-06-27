import { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";

import { CareProviderSearchResult } from "../../types";
import BasicResultDetail from "../ResultDetail/BasicResultDetail";
import MilesAway from "./MilesAway";

type ResultCardProps = {
  data: CareProviderSearchResult;
};

export default function ResultCard({
  data,
  children,
}: PropsWithChildren<ResultCardProps>) {
  const location = useLocation();
  return (
    <div>
      <MilesAway meters={data.distance} />
      <h3 className="usa-card__heading margin-top-1">
        <Link
          to={`/result/${data.id}`}
          state={{ prevSearch: location.search, data }}
        >
          {data.name}
        </Link>
      </h3>
      <BasicResultDetail headingLevel="h4" result={data} />
      {children}
    </div>
  );
}
