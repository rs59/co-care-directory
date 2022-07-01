import { Grid, Footer as USWDSFooter } from "@trussworks/react-uswds";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ReactComponent as ColoradoBhaLogoWhite } from "../images/logos/colorado_bha_white.svg";

const T_PREFIX = "components.footer.";
const betaLabel = (
  <span className="text-normal text-base-darker font-body-sm bg-accent-warm-lighter radius-pill padding-x-1 margin-right-1">
    BETA
  </span>
);
function Footer() {
  const { t } = useTranslation();
  return (
    <USWDSFooter
      primary={<></>}
      secondary={
        <Grid
          row
          tablet={{ col: true }}
          className="flex-justify-end flex-align-end"
        >
          <Grid col="auto" tablet={{ col: 6 }} className="font-body-2xs">
            <Grid row>
              <p>
                {betaLabel}
                {t(`${T_PREFIX}betaExplanation`)}
              </p>
            </Grid>
            <Grid row>
              {t(`${T_PREFIX}feedbackPrompt`)}
              <Link to="GOOGLE FORM LINK">{t(`${T_PREFIX}feedbackCta`)}</Link>
            </Grid>
          </Grid>
          <Grid col="auto" tablet={{ col: 6 }}>
            <Grid row className="flex-justify-end">
              <ColoradoBhaLogoWhite height={30} />
            </Grid>
            <Grid row className="flex-justify-end margin-top-2">
              © 2022
            </Grid>
          </Grid>
        </Grid>
      }
    />
  );
}

export default Footer;
