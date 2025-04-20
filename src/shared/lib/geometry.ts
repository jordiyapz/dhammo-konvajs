
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
}/**
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

