import React from "react";
import { CardGroup, Grid, GridContainer } from "@trussworks/react-uswds";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useTranslation } from "react-i18next";
import ContentCard from "../components/Home/ContentCard";
import heroPath from "../images/hero.png";
import { ReactComponent as ColoradoCrisisServicesLogo } from "../images/logos/colorado_crisis_services.svg";
import { ReactComponent as IMatterLogo } from "../images/logos/imatter.svg";
import { ReactComponent as BhaLogo } from "../images/logos/bha.svg";
import ZipCard from "../components/Home/ZipCard";

const Hero = styled.img`
  max-width: 150%;
  margin-left: -9%; // WHY!
`;

const ContentOverlay = styled.div`
  position: relative;
  margin-top: -20%;
`;

const Heading = styled.h1`
  color: black;
  background-color: white;
  @media (min-width: 40em) {
    color: white;
    background-color: transparent;
  }
`;

function Home() {
  const { t } = useTranslation();
  const T_PREFIX = "pages.home.";

  return (
    <GridContainer>
      <Hero src={heroPath} />
      <ContentOverlay>
        <Grid row>
          <Grid col={12} tablet={{ col: 8 }}>
            <Heading className="radius-lg padding-2">
              {t(`${T_PREFIX}heading`)}
            </Heading>
            <CardGroup className="bg-white radius-lg padding-x-1 tablet:padding-y-2">
              <ZipCard />
            </CardGroup>
          </Grid>
        </Grid>
        <hr className="margin-bottom-3" />
        <Grid row>
          <Grid col={12}>
            <CardGroup>
              <ContentCard
                headerContent={<ColoradoCrisisServicesLogo />}
                bodyContent={
                  <>
                    <h2 className="font-body-lg">
                      {t(`${T_PREFIX}_coloradoCrisisService.heading`)}
                    </h2>
                    <p>{t(`${T_PREFIX}_coloradoCrisisService.content`)}</p>
                    <Link
                      to="https://coloradocrisisservices.org"
                      target="_blank"
                      type="external"
                    >
                      {t(`${T_PREFIX}_coloradoCrisisService.cta`)}
                    </Link>
                  </>
                }
              />
              <ContentCard
                headerContent={<IMatterLogo />}
                bodyContent={
                  <>
                    <h2 className="font-body-lg">
                      {t(`${T_PREFIX}_iMatter.heading`)}
                    </h2>
                    <p>{t(`${T_PREFIX}_iMatter.content`)}</p>
                    <Link
                      to="https://imattercolorado.org"
                      target="_blank"
                      type="external"
                    >
                      {t(`${T_PREFIX}_iMatter.cta`)}
                    </Link>
                  </>
                }
              />
              <ContentCard
                headerContent={<BhaLogo />}
                bodyContent={
                  <>
                    <h2 className="font-body-lg">
                      {t(`${T_PREFIX}_bha.heading`)}
                    </h2>
                    <p>{t(`${T_PREFIX}_bha.content`)}</p>
                    <Link to="/privacy-policy">
                      {t(`${T_PREFIX}_bha.cta`)}
                    </Link>{" "}
                  </>
                }
              />
            </CardGroup>
          </Grid>
        </Grid>
      </ContentOverlay>
    </GridContainer>
  );
}

export default Home;
