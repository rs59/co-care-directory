import {
  Button,
  Card,
  CardBody,
  Label,
  TextInput,
} from "@trussworks/react-uswds";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DEFAULT_RADIUS_MILES } from "../../util";

const ZipButton = styled(Button)`
  max-width: 6rem;
  margin-right: 0;
`;

function ZipCard() {
  const [zip, setZip] = useState<string>("");

  const { t } = useTranslation();
  const navigate = useNavigate();
  const T_PREFIX = "components.home.";
  return (
    <Card containerProps={{ className: "border-0" }}>
      <CardBody>
        <p>{t(`${T_PREFIX}zipPrompt`)}</p>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            navigate(`/search?zip=${zip}&miles=${DEFAULT_RADIUS_MILES}`, {
              replace: false,
            });
          }}
        >
          <Label htmlFor="zip" className="margin-bottom-1">
            {t(`${T_PREFIX}zipInput`)}
          </Label>
          <div className="display-flex">
            <TextInput
              className="margin-top-0 margin-right-1"
              id="zip"
              name="zip"
              type="text"
              maxLength={5}
              value={zip}
              onChange={
                (evt) => setZip(evt.target.value.replace(/[^0-9]+/g, "")) // only allow numbers
              }
            />
            <ZipButton type="submit" className="usa-button">
              {t(`${T_PREFIX}searchButton`)}
            </ZipButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default ZipCard;
