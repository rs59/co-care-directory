import {
  Button,
  Card,
  CardBody,
  Label,
  TextInput,
} from "@trussworks/react-uswds";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SearchFilters } from "../../types";
import { DEFAULT_RADIUS_MILES } from "../../util";
import ZipInput from "./ZipInput";

const ZipButton = styled(Button)`
  max-width: 6rem;
  max-height: 2.5rem;
  margin-right: 0;
`;

function ZipCard() {
  const [filters, setFilters] = useState<SearchFilters>({
    zip: "",
    miles: `${DEFAULT_RADIUS_MILES}`,
    typesOfHelp: [],
    feePreferences: [],
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const T_PREFIX = "components.home.";
  return (
    <Card
      className="margin-bottom-0"
      containerProps={{ className: "border-0 margin-bottom-0" }}
      gridLayout={{ col: 12, tablet: { col: 7 } }}
    >
      <CardBody>
        <p>{t(`${T_PREFIX}zipPrompt`)}</p>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            navigate({
              pathname: "/search",
              search: createSearchParams(filters).toString(),
            });
          }}
        >
          <div className="display-flex flex-align-end">
            <ZipInput filters={filters} setFilters={setFilters} />
            <ZipButton type="submit" className="usa-button margin-left-1">
              {t(`${T_PREFIX}searchButton`)}{" "}
            </ZipButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default ZipCard;
