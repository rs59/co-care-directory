import {
  Alert,
  Button,
  Form,
  GridContainer,
  StepIndicatorStep,
} from "@trussworks/react-uswds";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createSearchParams, useNavigate } from "react-router-dom";
import HelpRecipientInput, {
  HelpRecipient,
} from "../components/GuidedSearch/HelpRecipientInput";
import ZipInput from "../components/Home/ZipInput";
import { FilterFieldset } from "../components/Search/Filters/Control";
import DistanceInput from "../components/Search/Filters/DistanceInput";
import TypeOfHelpInput from "../components/Search/Filters/TypeOfHelpInput";
import { SearchFilters, TypeOfHelp } from "../types";
import { DEFAULT_RADIUS_MILES } from "../util";

const GUIDED_SEARCH_STEPS = [
  "helpRecipient",
  "typeOfHelp",
  "location",
  "distance",
];

const getStepStatus = (thisIdx: number, currentStepIdx: number) => {
  if (thisIdx === currentStepIdx) return "current";
  if (thisIdx < currentStepIdx) return "complete";
  return "incomplete";
};

function GuidedSearch() {
  const { t } = useTranslation();
  const T_PREFIX = "pages.guidedSearch.";

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
  const [helpRecipient, setHelpRecipient] = useState<HelpRecipient>(
    HelpRecipient.Yourself
  );

  // Error to display to user if they're blocked from progressing
  const [error, setError] = useState("");

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
        className="margin-y-4"
        onSubmit={(e) => {
          console.log(e);
          e.preventDefault();
          // zip is the only REQUIRED step
          // because zip is the only REQUIRED filter
          // TODO: replace this with calling getMatchingCare
          // and using error from there; this will also enable
          // showing counts for results alongside distance options
          if (currentStep === "location") {
            if (!searchFilters.zip) {
              setError("Zip code is required!");
              return;
            } else {
              setError("");
            }
          }
          goToNextStep();
        }}
      >
        {error && (
          <Alert noIcon type="error" headingLevel="h2">
            {error}
          </Alert>
        )}
        <div className="margin-y-2">
          {currentStep === "helpRecipient" ? (
            <HelpRecipientInput
              helpRecipient={helpRecipient}
              setHelpRecipient={setHelpRecipient}
            />
          ) : currentStep === "typeOfHelp" ? (
            <TypeOfHelpInput
              filters={searchFilters}
              setFilters={setSearchFilters}
              tPrefix={`${T_PREFIX}typeOfHelp.${helpRecipient}.`}
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
            <FilterFieldset legend={t(`${T_PREFIX}location.question`)}>
              <ZipInput filters={searchFilters} setFilters={setSearchFilters} />
            </FilterFieldset>
          ) : currentStep === "distance" ? (
            <DistanceInput
              filters={searchFilters}
              setFilters={setSearchFilters}
              tPrefix={`${T_PREFIX}distance.`}
            />
          ) : (
            <></>
          )}
        </div>

        <Button type="submit">{t(`${T_PREFIX}nextQuestion`)}</Button>
      </Form>
    </GridContainer>
  );
}

export default GuidedSearch;
