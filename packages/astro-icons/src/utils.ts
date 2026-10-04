import type { LineSegment } from './types.ts';

/**
 * Adjusts the positions of line segments by scaling their coordinates towards or away from a central point in a
 * fixed svg coordinate system: 0 0 24 24.
 *
 * @param lines - An array of line segment objects, each with properties x1, y1, x2, and y2.
 * @param [factor=0.75] - A scaling factor that determines the degree of adjustment. Values less than 1 bring
 *        the points closer to the center, making negative space, and values greater than 1 move them further away,
 *        making positive space.
 * @return A new array of line segments with adjusted coordinates.
 */
export function scaleLines(lines: LineSegment[], factor = 0.75): LineSegment[] {
  const center = 12;
  return lines.map((line) => ({
    x1: center + (line.x1 - center) * factor,
    y1: center + (line.y1 - center) * factor,
    x2: center + (line.x2 - center) * factor,
    y2: center + (line.y2 - center) * factor,
  }));
}

type FromToLineSegments = {
  fromLines: LineSegment[];
  toLines: LineSegment[];
};

/**
 * Matches and pairs line segments from two arrays based on their geometric proximity
 * by minimizing the distance between their centers.
 *
 * @param {LineSegment[]} from - An array of line segments to match from. Each line segment is represented by start
 *        and end points (x1, y1, x2, y2).
 * @param {LineSegment[]} to - An array of line segments to match to. Each line segment is represented by start
 *        and end points (x1, y1, x2, y2).
 * @return {FromToLineSegments} An object containing two arrays, `fromLines` and `toLines`, where each pair of
 *         corresponding lines is matched based on center proximity.
 */
export function matchLines(from: LineSegment[], to: LineSegment[]): FromToLineSegments {
  const maxLength = Math.max(from.length, to.length);
  const matchedFrom: LineSegment[] = [];
  const matchedTo: LineSegment[] = [];

  const availableFrom = [...from];
  const availableTo = [...to];

  while (availableFrom.length < maxLength) availableFrom.push({ x1: 12, y1: 12, x2: 12, y2: 12 });
  while (availableTo.length < maxLength) availableTo.push({ x1: 12, y1: 12, x2: 12, y2: 12 });

  for (let i = 0; i < maxLength; i++) {
    const fLine = availableFrom[i];
    if (fLine === undefined) continue;

    const fCenterX = (fLine.x1 + fLine.x2) / 2;
    const fCenterY = (fLine.y1 + fLine.y2) / 2;

    let bestIndex = 0;
    let minDistance = Infinity;

    for (let j = 0; j < availableTo.length; j++) {
      const tLine = availableTo[j];
      if (tLine === undefined) continue;

      const tCenterX = (tLine.x1 + tLine.x2) / 2;
      const tCenterY = (tLine.y1 + tLine.y2) / 2;

      const distance = Math.hypot(tCenterX - fCenterX, tCenterY - fCenterY);

      if (distance < minDistance) {
        minDistance = distance;
        bestIndex = j;
      }
    }

    matchedFrom.push(fLine);
    // biome-ignore lint/style/noNonNullAssertion: nom null assertion should be safe here
    matchedTo.push(availableTo.splice(bestIndex, 1)[0]!);
  }

  return { fromLines: matchedFrom, toLines: matchedTo };
}
