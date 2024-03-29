import { CareProviderSearchResult } from "../../types";
import ResultCard from "./ResultCard";

type ResultsListProps = {
  results: CareProviderSearchResult[];
  selectedResultId?: string;
  isMobile?: boolean;
};

const DESKTOP_CLASSES =
  "border-bottom border-base-lighter padding-y-3 padding-x-2";
const DESKTOP_CLASSES_ACTIVE =
  "border border-width-2px radius-sm border-primary-light padding-y-3 padding-x-2";
const MOBILE_CLASSES =
  "border border-base-lighter radius-lg padding-2 margin-bottom-1";

function ResultsList({
  results,
  selectedResultId,
  isMobile = false,
}: ResultsListProps) {
  return (
    <>
      {results.map((result) => (
        <div
          className={
            isMobile
              ? MOBILE_CLASSES
              : selectedResultId === result.id
              ? DESKTOP_CLASSES_ACTIVE
              : DESKTOP_CLASSES
          }
          // Only set id in the desktop list to avoid creating
          // duplicate DOM elements with same id in mobile list
          id={isMobile ? undefined : result.id}
          key={result.id}
        >
          <ResultCard data={result} />
        </div>
      ))}
    </>
  );
}

export default ResultsList;
