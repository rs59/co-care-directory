import { Button, Checkbox, Fieldset, Radio } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import { TFunction, useTranslation } from "react-i18next";
import { SearchFilters, TypeOfHelp } from "../../types";
import { MILE_DISTANCE_OPTIONS } from "../../util";

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
      label={t("components.searchFiltersControl.withinMiles", {
        n: miles,
      })}
      checked={filters.miles === miles}
      onChange={() => setDistanceFilter(miles)}
      value={miles}
      key={miles}
    />
  );

  return (
    <Fieldset legend={t("components.searchFiltersControl.distance")}>
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
    // since filters.typesOfHelp is an array of all selected options,
    // this is toggling a selection by either
    // adding the selected typeOfHelp to the array or
    // removing the selected typeOfHelp from the array
    const newValues = filters.typesOfHelp.includes(typeOfHelp)
      ? filters.typesOfHelp.filter((val) => val !== typeOfHelp)
      : [...filters.typesOfHelp, typeOfHelp];
    setFilters({ ...filters, typesOfHelp: newValues });
  };

  const getCheckbox = (typeOfHelp: TypeOfHelp) => (
    <Checkbox
      id={typeOfHelp}
      name="type of help"
      label={t(
        `components.searchFiltersControl.typeOfHelpAnswer.${typeOfHelp}`
      )}
      checked={filters.typesOfHelp.includes(typeOfHelp)}
      onChange={() => setTypeOfHelpFilter(typeOfHelp)}
      value={typeOfHelp}
    />
  );

  return (
    <Fieldset legend={t("components.searchFiltersControl.typeOfHelp")}>
      {getCheckbox(TypeOfHelp.SubstanceUse)}
      {getCheckbox(TypeOfHelp.CourtMandatedTreatment)}
      {getCheckbox(TypeOfHelp.MentalHealth)}
    </Fieldset>
  );
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
        {t("components.searchFiltersControl.toggleFiltersButton")}
      </Button>
      <div className={isExpanded ? "display-block" : "display-none"}>
        <div className="margin-y-3">
          <DistanceFilter filters={filters} setFilters={setFilters} t={t} />
        </div>
        <div className="margin-y-3">
          <TypeOfHelpFilter filters={filters} setFilters={setFilters} t={t} />
        </div>
        <Button
          type="button"
          className="usa-button"
          onClick={() => {
            onApplyFilters(filters);
            setIsExpanded(false);
          }}
        >
          {t("components.searchFiltersControl.viewResultsButton")}
        </Button>
      </div>
    </div>
  );
}

export default SearchFiltersControl;
