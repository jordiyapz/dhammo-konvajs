import Konva from "konva";

// Function to make the stage responsive
export function fitStageIntoParentContainer(options: {
  elementId: string;
  stage: Konva.Stage;
  virtualWidth: number;
  virtualHeight: number;
}) {
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
