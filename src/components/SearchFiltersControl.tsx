import { Button, Fieldset, Radio } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchFilters } from "../types";

function SearchFiltersControl({
  currentFilters,
  onApplyFilters,
}: {
  currentFilters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
}) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<SearchFilters>(currentFilters);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const setDistanceFilter = (milesStr: string) => {
    setFilters({ ...filters, miles: parseInt(milesStr) });
  };

  // if filter is closed, reset any filters that haven't been applied
  useEffect(() => {
    if (!isExpanded) {
      setFilters(currentFilters);
    }
  }, [isExpanded]);

  return (
    <div>
      <Button
        type="button"
        className="usa-button"
        onClick={() => setIsExpanded(!isExpanded)}
        outline
      >
        {t("components.SearchFiltersControl.toggleFiltersButton")}
      </Button>
      <div className={isExpanded ? "display-block" : "display-none"}>
        <div className="margin-y-3">
          <Fieldset legend={t("components.SearchFiltersControl.distance")}>
            <Radio
              id="10"
              name="within 10 miles"
              label={t("components.SearchFiltersControl.withinMiles", {
                n: 10,
              })}
              checked={filters.miles === 10}
              onChange={(evt) => setDistanceFilter(evt.target.value)}
              value="10"
            />
            <Radio
              id="25"
              name="within 25 miles"
              label={t("components.SearchFiltersControl.withinMiles", {
                n: 25,
              })}
              checked={filters.miles === 25}
              onChange={(evt) => setDistanceFilter(evt.target.value)}
              value="25"
            />
            <Radio
              id="50"
              name="within 50 miles"
              label={t("components.SearchFiltersControl.withinMiles", {
                n: 50,
              })}
              checked={filters.miles === 50}
              onChange={(evt) => setDistanceFilter(evt.target.value)}
              value="50"
            />
            <Radio
              id="100"
              name="within 100 miles"
              label={t("components.SearchFiltersControl.withinMiles", {
                n: 100,
              })}
              checked={filters.miles === 100}
              onChange={(evt) => setDistanceFilter(evt.target.value)}
              value="100"
            />
          </Fieldset>
        </div>
        <Button
          type="button"
          className="usa-button"
          onClick={() => {
            onApplyFilters(filters);
            setIsExpanded(false);
          }}
        >
          {t("components.SearchFiltersControl.viewResultsButton")}
        </Button>
      </div>
    </div>
  );
}

export default SearchFiltersControl;
