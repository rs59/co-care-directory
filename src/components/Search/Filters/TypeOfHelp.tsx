import { Checkbox, Fieldset } from "@trussworks/react-uswds";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { SearchFilters, TypeOfHelp } from "../../../types";
import { toggleItemInList } from "../../../util";
import { FilterFieldset } from "./Control";

type TypeOfHelpFilterProps = {
  options?: TypeOfHelp[];
  filters: SearchFilters;
  setFilters: Dispatch<SetStateAction<SearchFilters>>;
  tPrefix: string;
};

function TypeOfHelpFilter({
  options,
  filters,
  setFilters,
  tPrefix,
}: TypeOfHelpFilterProps) {
  const { t } = useTranslation();

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
      label={t(`${tPrefix}answers.${typeOfHelp}`)}
      checked={filters.typesOfHelp.includes(typeOfHelp)}
      onChange={() => setTypeOfHelpFilter(typeOfHelp)}
      value={typeOfHelp}
    />
  );

  return (
    <FilterFieldset legend={t(`${tPrefix}question`)}>
      {options?.map((opt) => getCheckbox(opt))}
    </FilterFieldset>
  );
}

export default TypeOfHelpFilter;
