import { ButtonGroup, Button } from "@trussworks/react-uswds";
import styled from "styled-components";

export type MobileViewToggleProps = {
  isListView: boolean;
  onShowMap: () => void;
  onShowList: () => void;
};

function MobileViewToggle({
  isListView,
  onShowMap,
  onShowList,
}: MobileViewToggleProps) {
  return (
    <div className="margin-bottom-2">
      <ButtonGroup type="segmented">
        <Button
          type="button"
          base={isListView}
          outline={!isListView}
          onClick={onShowList}
        >
          List view
        </Button>
        <Button
          type="button"
          base={!isListView}
          outline={isListView}
          onClick={onShowMap}
        >
          Map view
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default MobileViewToggle;
