import styled from 'styled-components'
import { Dropdown, Grid, Label, Link } from "@trussworks/react-uswds";
import { useTranslation } from "react-i18next";
import { ReactComponent as Globe } from '../images/globe.svg';
import caretDownURL from '../images/caret-down.svg';

const StyledDropdown = styled(Dropdown)`
  border: none;
  background: inherit;
  width: fit-content;
  padding-right: 1rem;
  margin-top: 0;
  font-size: .8rem;
  color: white;

  background-image: url(${caretDownURL});
  background-repeat: no-repeat;
  background-position: right;
  background-size: 15%;
`

function Banner() {
  const { i18n } = useTranslation();
  return (
    <div className="Banner usa-dark-background font-body-3xs">
      <section aria-label="Immediate help">
        <Grid row className="flex-justify flex-align-center margin-x-2">
          <Grid col>
            <Grid row>
              <Grid col="auto" className="margin-right-05"><span>Need immediate help?</span></Grid>
              <Grid col="auto"><Link href="tel:##########"> ###-###-TALK (####)</Link></Grid>
            </Grid>
          </Grid>
          <Grid col>
            <Grid row className="flex-justify-end flex-align-center">
            <Globe height={15} fill="white" />
              <Label srOnly={true} htmlFor="change-language">Change site language</Label>
              <StyledDropdown
                name="change-language"
                id="change-language"
                defaultValue={i18n.language}
                onChange={(evt) => i18n.changeLanguage(evt.target.value)}
              >
                <option className="usa-dark-background" value="en">English</option>
                <option className="usa-dark-background" value="es">Español</option>
              </StyledDropdown>
            </Grid>
          </Grid>
        </Grid>
      </section>
    </div>
  )
}

export default Banner;