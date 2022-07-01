import { Checkbox } from "@trussworks/react-uswds";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { FeePreference, SearchFilters } from "../../../types";
import { toggleItemInList } from "../../../util";
import { FilterFieldset } from "./Control";

type FeesPreferenceInputProps = {
  filters: SearchFilters;
  setFilters: Dispatch<SetStateAction<SearchFilters>>;
  tPrefix: string;
};

// TODO: refactor so that FeePreferenceFilter and TypeOfHelpFilter share checkbox code
function FeesPreferenceInput({
  filters,
  setFilters,
  tPrefix,
}: FeesPreferenceInputProps) {
  const { t } = useTranslation();

  const setFeePreferenceFilter = (feePreference: FeePreference) => {
    setFilters({
      ...filters,
      feePreferences: toggleItemInList(filters.feePreferences, feePreference),
    });
  };

  // TODO: consolidate getCheckbox logic? (see TypeOfHelpInput)
  const getCheckbox = (feePreference: FeePreference) => (
    <Checkbox
      id={feePreference}
      name="payment options"
      label={t(`${tPrefix}answers.${feePreference}`)}
      checked={filters.feePreferences.includes(feePreference)}
      onChange={() => setFeePreferenceFilter(feePreference)}
      value={feePreference}
    />
  );

  return (
    <FilterFieldset legend={t(`${tPrefix}question`)}>
      {getCheckbox("PrivateInsurance")}
      {getCheckbox("Medicaid")}
      {getCheckbox("SlidingFeeScale")}
    </FilterFieldset>
  );
}

export default FeesPreferenceInput;
