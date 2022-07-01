import { Label, TextInput } from "@trussworks/react-uswds";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { SearchFilters } from "../../types";

type ZipInputProps = {
  filters: SearchFilters;
  setFilters: Dispatch<SetStateAction<SearchFilters>>;
};

function ZipInput({ filters, setFilters }: ZipInputProps) {
  const { t } = useTranslation();
  return (
    <div className="width-full">
      <Label htmlFor="zip" className="margin-bottom-1">
        {t(`common.zipCode`)}
      </Label>
      <TextInput
        className="margin-top-0"
        id="zip"
        name="zip"
        type="text"
        maxLength={5}
        value={filters.zip}
        onChange={(evt) =>
          setFilters({
            ...filters,
            zip: evt.target.value.replace(/[^0-9]+/g, ""), // only allow numbers
          })
        }
      />
    </div>
  );
}

export default ZipInput;
