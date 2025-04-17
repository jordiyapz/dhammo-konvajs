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

/**
 * Calculate the radius of a larger circle that can encompass a specified number
 * of smaller circles arranged in a tangent to one another.
 *
 * @param radiusOfChildren - The radius of each smaller circle.
 * @param numOfChildren - The number of smaller circles to encompass.
 * @param gap - The gap between the smaller circles.
 * @returns The radius of the larger encompassing circle.
 */

export function computeLargeRadius(
  radiusOfChild: number,
  numOfChildren: number,
  gap: number = 0
): number {
  const angle = Math.PI / numOfChildren;
  // return radiusOfChild * (1 / Math.sin(angle));
  return (2 * radiusOfChild + gap) / (2 * Math.sin(angle));
}

/**
 * Generate 2D points around a circle centered at (0, 0).
 *
 * @param numPoints - Number of points to generate.
 * @param radius - Radius of the circle.
 * @returns Array of [x, y] points.
 */
export function generateCirclePoints(
  numPoints: number,
  radius: number
): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints; // Divide circle into equal angles
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
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
