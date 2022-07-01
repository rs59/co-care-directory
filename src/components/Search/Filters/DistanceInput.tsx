import { Fieldset, Radio } from "@trussworks/react-uswds";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { SearchFilters } from "../../../types";
import { MILE_DISTANCE_OPTIONS } from "../../../util";
import { FilterFieldset } from "./Control";

type DistanceInputProps = {
  filters: SearchFilters;
  setFilters: Dispatch<SetStateAction<SearchFilters>>;
  tPrefix: string;
};

function DistanceInput({ filters, setFilters, tPrefix }: DistanceInputProps) {
  const { t } = useTranslation();

  const setDistanceFilter = (miles: string) => {
    setFilters({ ...filters, miles });
  };

  // TODO: consolidate getRadio logic? (see HelpRecipientInput)
  const getRadio = (miles: string) => (
    <Radio
      id={miles.toString()}
      name="distance"
      label={t(`${tPrefix}withinMiles`, {
        n: miles,
      })}
      checked={filters.miles === miles}
      onChange={() => setDistanceFilter(miles)}
      value={miles}
      key={miles}
    />
  );

  return (
    <FilterFieldset legend={t(`${tPrefix}distance`)}>
      {MILE_DISTANCE_OPTIONS.map((miles) => getRadio(miles))}
    </FilterFieldset>
  );
}

export default DistanceInput;
