import { Button, Checkbox, Fieldset, Radio } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import { TFunction, useTranslation } from "react-i18next";
import { FeePreference, SearchFilters, TypeOfHelp } from "../../types";
import { MILE_DISTANCE_OPTIONS, toggleItemInList } from "../../util";

const T_PREFIX = "components.search.";
const DistanceFilter = ({
  filters,
  setFilters,
  t,
}: {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  t: TFunction;
}) => {
  const setDistanceFilter = (miles: number) => {
    setFilters({ ...filters, miles });
  };

  const getRadio = (miles: number) => (
    <Radio
      id={miles.toString()}
      name="distance"
      label={t(`${T_PREFIX}withinMiles`, {
        n: miles,
      })}
      checked={filters.miles === miles}
      onChange={() => setDistanceFilter(miles)}
      value={miles}
      key={miles}
    />
  );

  return (
    <Fieldset legend={t(`${T_PREFIX}distance`)}>
      {MILE_DISTANCE_OPTIONS.map((miles) => getRadio(miles))}
    </Fieldset>
  );
};

const TypeOfHelpFilter = ({
  filters,
  setFilters,
  t,
}: {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  t: TFunction;
}) => {
  const setTypeOfHelpFilter = (typeOfHelp: TypeOfHelp) => {
    setFilters({
      ...filters,
      typesOfHelp: toggleItemInList(filters.typesOfHelp, typeOfHelp),
    });
  };

  const getCheckbox = (typeOfHelp: TypeOfHelp) => (
    <Checkbox
      id={typeOfHelp}
      name="type of help"
      label={t(`${T_PREFIX}typeOfHelpAnswer.${typeOfHelp}`)}
      checked={filters.typesOfHelp.includes(typeOfHelp)}
      onChange={() => setTypeOfHelpFilter(typeOfHelp)}
      value={typeOfHelp}
    />
  );

  return (
    <Fieldset legend={t(`${T_PREFIX}typeOfHelp`)}>
      {getCheckbox(TypeOfHelp.SubstanceUse)}
      {getCheckbox(TypeOfHelp.CourtMandatedTreatment)}
      {getCheckbox(TypeOfHelp.MentalHealth)}
    </Fieldset>
  );
};

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
    <Fieldset legend={t(`${T_PREFIX}feePreference`)}>
      {getCheckbox("PrivateInsurance")}
      {getCheckbox("Medicaid")}
      {getCheckbox("SlidingFeeScale")}
    </Fieldset>
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
        className="usa-button"
        onClick={() => setIsExpanded(!isExpanded)}
        outline={countSelected === 0}
      >
        {t(`${T_PREFIX}toggleFiltersButton`, {
          count: countSelected,
        })}
      </Button>
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
      <div className={isExpanded ? "display-block" : "display-none"}>
        <div className="margin-y-3">
          <DistanceFilter filters={filters} setFilters={setFilters} t={t} />
        </div>
        <div className="margin-y-3">
          <TypeOfHelpFilter filters={filters} setFilters={setFilters} t={t} />
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
        <Button type="button" onClick={() => setIsExpanded(false)} unstyled>
          {t("common.cancel")}
        </Button>
      </div>
    </div>
  );
}

export default SearchFiltersControl;
