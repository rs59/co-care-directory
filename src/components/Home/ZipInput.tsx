import { Label, TextInput } from "@trussworks/react-uswds";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { SearchFilters } from "../../types";

type ZipInputProps = {
  filters: SearchFilters;
  setFilters: Dispatch<SetStateAction<SearchFilters>>;
  tPrefix: string;
};

function ZipInput({ filters, setFilters, tPrefix }: ZipInputProps) {
  const { t } = useTranslation();
  return (
    <div className="width-full">
      <Label htmlFor="zip" className="margin-bottom-1">
        {t(`${tPrefix}zipInput`)}
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
