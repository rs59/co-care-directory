import { CareProviderSearchResult } from "../../types";
import ResultCard from "./ResultCard";

type ResultsListProps = {
  results: CareProviderSearchResult[];
  isMobile?: boolean;
};

const DESKTOP_CLASSES =
  "border-bottom border-base-lighter padding-y-3 padding-right-2";
const MOBILE_CLASSES =
  "border border-base-lighter radius-lg padding-2 margin-bottom-1";

function ResultsList({ results, isMobile = false }: ResultsListProps) {
  return (
    <>
      {results.map((result) => (
        <div
          className={isMobile ? MOBILE_CLASSES : DESKTOP_CLASSES}
          key={result.id}
        >
          <ResultCard data={result} />
        </div>
      ))}
    </>
  );
}

export default ResultsList;
