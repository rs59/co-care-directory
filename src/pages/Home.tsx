import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  Label,
  TextInput,
} from "@trussworks/react-uswds";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { DEFAULT_RADIUS_MILES } from "../util";
import { useTranslation } from "react-i18next";

const ZipButton = styled(Button)`
  max-width: 6rem;
  margin-right: 0;
`;

function Home() {
  const { t } = useTranslation();
  const [zip, setZip] = useState<string>("");

  const navigate = useNavigate();

  return (
    <GridContainer>
      <Grid row className="padding-top-4">
        <Grid col={12} tablet={{ col: 6 }}>
          <CardGroup>
            <Card>
              <CardHeader>
                <h1 className="usa-card__heading">{t("pages.home.heading")}</h1>
              </CardHeader>
              <CardBody>
                <p>{t("pages.home.zipPrompt")}</p>
                <form
                  onSubmit={(evt) => {
                    evt.preventDefault();
                    navigate(
                      `/search?zip=${zip}&miles=${DEFAULT_RADIUS_MILES}`,
                      {
                        replace: false,
                      }
                    );
                  }}
                >
                  <Label htmlFor="zip" className="margin-bottom-1">
                    {t("common.zipInput")}
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
                        (evt) =>
                          setZip(evt.target.value.replace(/[^0-9]+/g, "")) // only allow numbers
                      }
                    />
                    <ZipButton type="submit" className="usa-button">
                      {t("common.searchButton")}
                    </ZipButton>
                  </div>
                </form>
              </CardBody>
            </Card>
          </CardGroup>
        </Grid>
      </Grid>
    </GridContainer>
  );
}

export default Home;
