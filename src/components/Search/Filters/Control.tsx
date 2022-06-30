import { Button, Checkbox, Fieldset } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import { TFunction, useTranslation } from "react-i18next";
import styled from "styled-components";
import { FeePreference, SearchFilters, TypeOfHelp } from "../../../types";
import { toggleItemInList } from "../../../util";
import DistanceFilter from "./Distance";
import TypeOfHelpFilter from "./TypeOfHelp";

export const FilterFieldset = styled(Fieldset)`
  legend {
    font-weight: bold;
  }
`;

const T_PREFIX = "components.search.";

// TODO: refactor so that FeePreferenceFilter and TypeOfHelpFilter share checkbox code
const FeePreferenceFilter = ({
  filters,
  setFilters,
  t,
}: {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  t: TFunction;
}) => {
  const setFeePreferenceFilter = (feePreference: FeePreference) => {
    setFilters({
      ...filters,
      feePreferences: toggleItemInList(filters.feePreferences, feePreference),
    });
  };

  const getCheckbox = (feePreference: FeePreference) => (
    <Checkbox
      id={feePreference}
      name="payment options"
      label={t(`${T_PREFIX}feePreferenceAnswer.${feePreference}`)}
      checked={filters.feePreferences.includes(feePreference)}
      onChange={() => setFeePreferenceFilter(feePreference)}
      value={feePreference}
    />
  );

  return (
    <FilterFieldset legend={t(`${T_PREFIX}feePreference`)}>
      {getCheckbox("PrivateInsurance")}
      {getCheckbox("Medicaid")}
      {getCheckbox("SlidingFeeScale")}
    </FilterFieldset>
  );
};

const countOptionalFiltersSelected = (filters: SearchFilters): number => {
  let count = 0;
  if (filters.typesOfHelp.length) {
    count += 1;
  }
  if (filters.feePreferences.length) {
    count += 1;
  }
  return count;
};

const clearOptionalFilters = (filters: SearchFilters): SearchFilters => {
  return {
    ...filters,
    typesOfHelp: [],
    feePreferences: [],
  };
};

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

  const countSelected = countOptionalFiltersSelected(currentFilters);

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
        className="usa-button--base radius-pill"
        onClick={() => setIsExpanded(!isExpanded)}
        outline={countSelected === 0}
      >
        {t(`${T_PREFIX}toggleFiltersButton`, {
          count: countSelected,
        })}
      </Button>
      <div className={isExpanded ? "display-block" : "display-none"}>
        <div className="margin-y-2">
          {countSelected > 0 && (
            <Button
              type="button"
              onClick={() => {
                const cleared = clearOptionalFilters(filters);
                setFilters(cleared);
                onApplyFilters(cleared);
              }}
              unstyled
            >
              {t(`${T_PREFIX}clearFiltersButton`)}
            </Button>
          )}
        </div>
        <div className="margin-y-3">
          <DistanceFilter
            filters={filters}
            setFilters={setFilters}
            tPrefix={`${T_PREFIX}filters.distance.`}
          />
        </div>
        <div className="margin-y-3">
          <TypeOfHelpFilter
            options={[
              TypeOfHelp.SubstanceUse,
              TypeOfHelp.CourtMandatedTreatment,
              TypeOfHelp.MentalHealth,
            ]}
            filters={filters}
            setFilters={setFilters}
            tPrefix={`${T_PREFIX}filters.typeOfHelp.`}
          />
        </div>
        <div className="margin-y-3">
          <FeePreferenceFilter
            filters={filters}
            setFilters={setFilters}
            t={t}
          />
        </div>
        <Button
          type="button"
          className="usa-button"
          onClick={() => {
            onApplyFilters(filters);
            setIsExpanded(false);
          }}
        >
          {t(`${T_PREFIX}viewResultsButton`)}
        </Button>
        <div className="padding-top-2">
          <Button type="button" onClick={() => setIsExpanded(false)} unstyled>
            {t("common.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SearchFiltersControl;
