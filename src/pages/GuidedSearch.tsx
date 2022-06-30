import {
  Button,
  Fieldset,
  Form,
  GridContainer,
  Label,
  Radio,
  StepIndicatorStep,
  TextInput,
} from "@trussworks/react-uswds";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createSearchParams, useNavigate } from "react-router-dom";
import DistanceFilter from "../components/Search/Filters/Distance";
import TypeOfHelpFilter from "../components/Search/Filters/TypeOfHelp";
import { SearchFilters, TypeOfHelp } from "../types";
import { DEFAULT_RADIUS_MILES } from "../util";

const GUIDED_SEARCH_STEPS = ["who", "typeOfHelp", "location", "distance"];

const getStepStatus = (thisIdx: number, currentStepIdx: number) => {
  if (thisIdx === currentStepIdx) return "current";
  if (thisIdx < currentStepIdx) return "complete";
  return "incomplete";
};

function GuidedSearch() {
  const { t } = useTranslation();

  // Index of current step
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  // Object containing search filters from input from completed steps
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    zip: "",
    miles: `${DEFAULT_RADIUS_MILES}`,
    typesOfHelp: [],
    feePreferences: [],
  });

  // Care target to display appropriate copy for `type of help` step
  const [careTarget, setCareTarget] = useState<"yourself" | "someone">(
    "yourself"
  );

  // Helper func to progress through steps, or navigate to
  // search results with supplied filters if all steps completed
  const navigate = useNavigate();
  const goToNextStep = () => {
    if (currentStepIdx < GUIDED_SEARCH_STEPS.length - 1) {
      setCurrentStepIdx((idx) => idx + 1);
    } else {
      navigate({
        pathname: "/search",
        search: createSearchParams(searchFilters).toString(),
      });
    }
  };

  const currentStep = GUIDED_SEARCH_STEPS[currentStepIdx];
  return (
    <GridContainer>
      <h1>
        <span className="usa-sr-only">Guided search </span>Question{" "}
        {currentStepIdx + 1} of {GUIDED_SEARCH_STEPS.length}
      </h1>
      <div className="usa-step-indicator usa-step-indicator--no-labels">
        <div className="usa-step-indicator__segments">
          {GUIDED_SEARCH_STEPS.map((step, idx) => (
            <StepIndicatorStep
              key={step}
              status={getStepStatus(idx, currentStepIdx)}
              label={step}
            />
          ))}
        </div>
      </div>
      <Form
        onSubmit={(e) => {
          console.log(e);
          e.preventDefault();
          goToNextStep();
        }}
      >
        {currentStep === "who" ? (
          <div>
            <Fieldset legend={t(`pages.guidedSearch.who.question`)}>
              <Radio
                id="yourself"
                name="yourself"
                label={t(`pages.guidedSearch.who.answers.yourself`)}
                checked={careTarget === "yourself"}
                key="yourself"
                onChange={() => setCareTarget("yourself")}
              />
              <Radio
                id="someone"
                name="someone"
                label={t(`pages.guidedSearch.who.answers.someone`)}
                checked={careTarget === "someone"}
                key="someone"
                onChange={() => setCareTarget("someone")}
              />
            </Fieldset>
          </div>
        ) : currentStep === "typeOfHelp" ? (
          <TypeOfHelpFilter
            filters={searchFilters}
            setFilters={setSearchFilters}
            tPrefix={`pages.guidedSearch.typeOfHelp.${careTarget}.`}
            options={[
              TypeOfHelp.SubstanceUse,
              TypeOfHelp.CourtMandatedTreatment,
              TypeOfHelp.MentalHealth,
              TypeOfHelp.SuicidalIdeation,
              TypeOfHelp.Unsure,
              TypeOfHelp.None,
            ]}
          />
        ) : currentStep === "location" ? (
          <>
            <Label htmlFor="zip">
              {t(`pages.guidedSearch.location.question`)}
            </Label>
            <TextInput
              id="zip"
              name="zip"
              type="number"
              maxLength={5}
              onChange={(evt) =>
                setSearchFilters({ ...searchFilters, zip: evt.target.value })
              }
            />
          </>
        ) : currentStep === "distance" ? (
          <DistanceFilter
            filters={searchFilters}
            setFilters={setSearchFilters}
            tPrefix={`pages.guidedSearch.distance.`}
          />
        ) : (
          <></>
        )}

        <Button type="submit">Next question</Button>
      </Form>
    </GridContainer>
  );
}

export default GuidedSearch;
