import { Radio } from "@trussworks/react-uswds";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { FilterFieldset } from "../Search/Filters/Control";

export enum HelpRecipient {
  Yourself = "yourself",
  SomeoneElse = "someone",
}

type HelpRecipientInputProps = {
  helpRecipient: HelpRecipient;
  setHelpRecipient: Dispatch<SetStateAction<HelpRecipient>>;
};

function HelpRecipientInput({
  helpRecipient,
  setHelpRecipient,
}: HelpRecipientInputProps) {
  const { t } = useTranslation();
  const T_PREFIX = "pages.guidedSearch.helpRecipient.";

  // TODO: consolidate getRadio logic? (see DistanceInput)
  const getRadio = (rec: HelpRecipient) => (
    <Radio
      id={rec}
      name={rec}
      label={t(`${T_PREFIX}answers.${rec}`)}
      checked={helpRecipient === rec}
      key={rec}
      onChange={() => setHelpRecipient(rec)}
    />
  );
  return (
    <FilterFieldset legend={t(`${T_PREFIX}question`)}>
      {getRadio(HelpRecipient.Yourself)}
      {getRadio(HelpRecipient.SomeoneElse)}
    </FilterFieldset>
  );
}

export default HelpRecipientInput;
