import Konva from "konva";

type StageFitOptions = {
  elementId: string;
  stage: Konva.Stage;
  virtualWidth: number;
  virtualHeight: number;
};

// Function to make the stage responsive
export function fitStageIntoParentContainerWidth(options: StageFitOptions) {
  // Get the container element
  const container = document.getElementById(options.elementId);
  if (!container) return;

  const { stage, virtualWidth, virtualHeight } = options;

  // Make the container take up the full width
  container.style.width = "100%";

  // Get current container width
  const currentContainerWidth = container.offsetWidth;

  // Calculate scale based on virtual width vs actual width
  const scale = currentContainerWidth / virtualWidth;

  // Set stage dimensions and scale
  stage.width(virtualWidth * scale);
  stage.height(virtualHeight * scale);
  stage.scale({ x: scale, y: scale });
}

export function fitStageIntoParentContainerHeight(options: StageFitOptions) {
  // Get the container element
  const container = document.getElementById(options.elementId);
  if (!container) return;

  const { stage, virtualWidth, virtualHeight } = options;

  // Make the container take up the full width
  container.style.height = "100vh";

  // Get current container width
  const currentContainerHeight = container.offsetHeight;

  // Calculate scale based on virtual width vs actual width
  const scale = currentContainerHeight / virtualHeight;

  // Set stage dimensions and scale
  stage.width(virtualWidth * scale);
  stage.height(virtualHeight * scale);
  stage.scale({ x: scale, y: scale });
}

export function fitStageBestFit(options: StageFitOptions) {
  const container = document.getElementById(options.elementId);
  if (!container) return;

  const currentContainerHeight = container.offsetHeight;
  const currentContainerWidth = container.offsetWidth;

  if (currentContainerHeight > currentContainerWidth) {
    fitStageIntoParentContainerWidth(options);
  } else {
    fitStageIntoParentContainerHeight(options);
  }
}

export function setCursorStyle(
  stage: Konva.Stage,
  cursorStyle: // general
  | "default"
    | "auto"
    | "none"
    // links & status
    | "context-menu"
    | "pointer"
    | "progress"
    | "wait"
    // selection
    | "cell"
    | "crosshair"
    | "text"
    | "vertical-text"
    // drag & drop
    | "alias"
    | "copy"
    | "move"
    | "no-drop"
    | "not-allowed"
    | "grab"
    | "grabbing"
    // resizing & scrolling
    | "col-resize"
    | "row-resize"
    | "n-resize"
    | "e-resize"
    | "s-resize"
    | "w-resize"
    | "ne-resize"
    | "nw-resize"
    | "se-resize"
    | "sw-resize"
    // zoom
    | "zoom-in"
    | "zoom-out"
) {
  stage.container().style.cursor = cursorStyle;
}
