// packages/astro-icons/src/line-icons.ts

/*
 * Line icons are SVG line segments that can be used to morph/transform shapes from one set of line segments
 * to another set of line segments.
 */

import type { LineSegment } from './types';

/**
 * Line segments for an asterisk icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const asteriskLines: LineSegment[] = [
  { x1: 4, y1: 12, x2: 20, y2: 12 },
  { x1: 12, y1: 4, x2: 12, y2: 20 },
  { x1: 6, y1: 6, x2: 18, y2: 18 },
  { x1: 6, y1: 18, x2: 18, y2: 6 },
];

/**
 * Line segments for a check mark icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const checkMarkLines: LineSegment[] = [
  { x1: 4, y1: 12, x2: 9, y2: 17 },
  { x1: 9, y1: 17, x2: 18, y2: 6 },
];

/**
 * Line segments for a triple line icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const tripleLines: LineSegment[] = [
  { x1: 4, y1: 6, x2: 20, y2: 6 },
  { x1: 4, y1: 12, x2: 20, y2: 12 },
  { x1: 4, y1: 18, x2: 20, y2: 18 },
];

/**
 * Line segments for a vertical triple line icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const verticalTripleLines: LineSegment[] = [
  { x1: 5, y1: 4, x2: 5, y2: 20 },
  { x1: 12, y1: 4, x2: 12, y2: 20 },
  { x1: 19, y1: 4, x2: 19, y2: 20 },
];

/**
 * Line segments for an X shape icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const xLines: LineSegment[] = [
  { x1: 5, y1: 5, x2: 19, y2: 19 },
  { x1: 12, y1: 12, x2: 12, y2: 12 },
  { x1: 5, y1: 19, x2: 19, y2: 5 },
];

/**
 * Line segments for a plus sign icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const plusLines: LineSegment[] = [
  { x1: 4, y1: 12, x2: 20, y2: 12 },
  { x1: 12, y1: 4, x2: 12, y2: 20 },
];

/**
 * Line segments for a single line (a minus sign) icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const singleLine: LineSegment[] = [
  { x1: 4, y1: 12, x2: 20, y2: 12 },
  { x1: 12, y1: 12, x2: 12, y2: 12 },
];

/**
 * Line segments for a double line (an equal sign) icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const doubleLines: LineSegment[] = [
  { x1: 4, y1: 9, x2: 20, y2: 9 },
  { x1: 4, y1: 15, x2: 20, y2: 15 },
];

/**
 * Line segments for a vertical double line (pause symbol) icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const verticalDoubleLines: LineSegment[] = [
  { x1: 9, y1: 5, x2: 9, y2: 19 },
  { x1: 15, y1: 5, x2: 15, y2: 19 },
];

/**
 * Line segments for a vertical single line icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const verticalSingleLine: LineSegment[] = [{ x1: 12, y1: 5, x2: 12, y2: 19 }];

/**
 * Line segments for an icon with an arrow pointing left.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const arrowPointingLeftLines: LineSegment[] = [
  { x1: 20, y1: 12, x2: 4, y2: 12 },
  { x1: 4, y1: 12, x2: 10, y2: 6 },
  { x1: 4, y1: 12, x2: 10, y2: 18 },
];

/**
 * Line segments for an icon with an arrow pointing right.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const arrowPointingRightLines: LineSegment[] = [
  { x1: 4, y1: 12, x2: 20, y2: 12 },
  { x1: 20, y1: 12, x2: 14, y2: 6 },
  { x1: 20, y1: 12, x2: 14, y2: 18 },
];

/**
 * Line segments for an icon with an arrow pointing up.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const arrowPointingUpLines: LineSegment[] = [
  { x1: 12, y1: 20, x2: 12, y2: 4 },
  { x1: 12, y1: 4, x2: 6, y2: 10 },
  { x1: 12, y1: 4, x2: 18, y2: 10 },
];

/**
 * Line segments for an icon with an arrow pointing down.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const arrowPointingDownLines: LineSegment[] = [
  { x1: 12, y1: 4, x2: 12, y2: 20 },
  { x1: 12, y1: 20, x2: 6, y2: 14 },
  { x1: 12, y1: 20, x2: 18, y2: 14 },
];

/**
 * Line segments for a chevron icon pointing left.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const chevronPointingLeftLines: LineSegment[] = [
  { x1: 15, y1: 5, x2: 8, y2: 12 },
  { x1: 8, y1: 12, x2: 15, y2: 19 },
];

/**
 * Line segments for a chevron icon pointing right.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const chevronPointingRightLines: LineSegment[] = [
  { x1: 9, y1: 5, x2: 16, y2: 12 },
  { x1: 16, y1: 12, x2: 9, y2: 19 },
];

/**
 * Line segments for a chevron icon pointing up.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const chevronPointingUpLines: LineSegment[] = [
  { x1: 5, y1: 15, x2: 12, y2: 8 },
  { x1: 12, y1: 8, x2: 19, y2: 15 },
];

/**
 * Line segments for a chevron icon pointing down.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const chevronPointingDownLines: LineSegment[] = [
  { x1: 5, y1: 9, x2: 12, y2: 16 },
  { x1: 12, y1: 16, x2: 19, y2: 9 },
];

/**
 * Line segments for an arrow icon pointing up right.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const arrowPointingUpRightLines: LineSegment[] = [
  { x1: 6, y1: 18, x2: 18, y2: 6 },
  { x1: 11, y1: 6, x2: 18, y2: 6 },
  { x1: 18, y1: 6, x2: 18, y2: 13 },
];

/**
 * Line segments for a triangle icon pointing right.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const trianglePointingRightLines: LineSegment[] = [
  { x1: 4, y1: 4, x2: 4, y2: 18 },
  { x1: 4, y1: 18, x2: 18, y2: 12 },
  { x1: 4, y1: 4, x2: 18, y2: 12 },
];

/**
 * Line segments for a triangle icon pointing up.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const trianglePointingUpLines: LineSegment[] = [
  { x1: 12, y1: 4, x2: 20, y2: 18 },
  { x1: 20, y1: 18, x2: 4, y2: 18 },
  { x1: 4, y1: 18, x2: 12, y2: 4 },
];

/**
 * Line segments for a triangle icon pointing down.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const trianglePointingDownLines: LineSegment[] = [
  { x1: 20, y1: 4, x2: 4, y2: 4 },
  { x1: 4, y1: 4, x2: 12, y2: 18 },
  { x1: 12, y1: 18, x2: 20, y2: 4 },
];

/**
 * Line segments for the last page icon.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const lastPageLines: LineSegment[] = [
  { x1: 20, y1: 5, x2: 20, y2: 19 },
  { x1: 9, y1: 5, x2: 16, y2: 12 },
  { x1: 16, y1: 12, x2: 9, y2: 19 },
];

/**
 * Line segments for the last page icon, pointing down.
 * Each object specifies the start and end points of a line segment with x and y coordinates.
 *
 * @type {LineSegment[]}
 */
export const lastPagePointingDownLines: LineSegment[] = [
  { x1: 5, y1: 9, x2: 12, y2: 16 },
  { x1: 12, y1: 16, x2: 19, y2: 9 },
  { x1: 4, y1: 20, x2: 20, y2: 20 },
];

/**
 * Line segments for the first page icon.
 * Each line is defined by its start and end points.
 *
 * @type {LineSegment[]}
 */
export const firstPageLines: LineSegment[] = [
  { x1: 4, y1: 5, x2: 4, y2: 19 },
  { x1: 15, y1: 5, x2: 8, y2: 12 },
  { x1: 8, y1: 12, x2: 15, y2: 19 },
];

/**
 * Line segments for the first page icon, pointing up.
 * Each line is defined by its start and end points.
 *
 * @type {LineSegment[]}
 */
export const firstPagePointingUpLines: LineSegment[] = [
  { x1: 5, y1: 15, x2: 12, y2: 8 },
  { x1: 12, y1: 8, x2: 19, y2: 15 },
  { x1: 4, y1: 20, x2: 20, y2: 20 },
];

/**
 * Line segments for a 2x2 grid icon.
 * Each line is defined by its start and end points.
 *
 * Try e.g., morphing from/to this to a list icon or an X icon.
 *
 * @type {LineSegment[]}
 */
export const gridLines: LineSegment[] = [
  { x1: 4, y1: 9, x2: 20, y2: 9 },
  { x1: 4, y1: 15, x2: 20, y2: 15 },
  { x1: 9, y1: 5, x2: 9, y2: 19 },
  { x1: 15, y1: 5, x2: 15, y2: 19 },
];

/**
 * Line segments for a kebab menu (three vertical dots) icon.
 * Each line is defined by its start and end points.
 *
 * Try e.g., morphing from/to triple lines to this.
 *
 * @type {LineSegment[]}
 */
export const kebabMenuLines: LineSegment[] = [
  { x1: 12, y1: 6, x2: 12, y2: 6.01 },
  { x1: 12, y1: 12, x2: 12, y2: 12.01 },
  { x1: 12, y1: 18, x2: 12, y2: 18.01 },
];

/**
 * Line segments for a filter icon.
 * Each line is defined by its start and end points.
 *
 * Try e.g., morphing from/to triple lines to this.
 *
 * @type {LineSegment[]}
 */
export const filterLines: LineSegment[] = [
  { x1: 4, y1: 6, x2: 20, y2: 6 },
  { x1: 7, y1: 12, x2: 17, y2: 12 },
  { x1: 11, y1: 18, x2: 13, y2: 18 },
];

/**
 * Line segments for a stop square icon.
 * Each line is defined by its start and end points.
 *
 * Try e.g., morphing from/to trianglePointingUpLines or double vertical lines to this.
 *
 * @type {LineSegment[]}
 */
export const stopSquareLines: LineSegment[] = [
  { x1: 6, y1: 6, x2: 18, y2: 6 },
  { x1: 18, y1: 6, x2: 18, y2: 18 },
  { x1: 18, y1: 18, x2: 6, y2: 18 },
  { x1: 6, y1: 18, x2: 6, y2: 6 },
];

/**
 * Line segments for an info icon.
 * Each line is defined by its start and end points.
 *
 * Try e.g., morphing from/to plusLines or xLines to this.
 *
 * @type {LineSegment[]}
 */
export const infoLines: LineSegment[] = [
  { x1: 12, y1: 5, x2: 12, y2: 5.01 },
  { x1: 12, y1: 9, x2: 12, y2: 19 },
];

/**
 * Line segments for an external link icon.
 * Each line is defined by its start and end points.
 *
 * Try e.g., morphing from/to arrowPointingUpRightLines to this.
 *
 * @type {LineSegment[]}
 */
// En samlet matrise for Ekstern Lenke (Boks + Pil opp/høyre)
export const externalLinkLines: LineSegment[] = [
  // Selve boksen (krympet litt inn for å gi plass til pilen)
  { x1: 12, y1: 7, x2: 5, y2: 7 }, // box top line (half)
  { x1: 5, y1: 7, x2: 5, y2: 19 }, // left box
  { x1: 5, y1: 19, x2: 17, y2: 19 }, // bottom box
  { x1: 17, y1: 19, x2: 17, y2: 12 }, // right boks (half)

  // Arrow pointing up/right
  { x1: 10, y1: 14, x2: 19, y2: 5 },
  { x1: 14, y1: 5, x2: 19, y2: 5 },
  { x1: 19, y1: 5, x2: 19, y2: 10 },
];

/**
 * A Map object that associates string keys with arrays of `LineSegment` objects representing different line-based
 * icon shapes. Each key corresponds to a unique line-based icon descriptor, and each value is an array of
 * `LineSegment` objects that define the geometric representation of the respective icon.
 *
 * The following keys are available:
 * - `arrowPointingDownLines`: Represents an arrow icon pointing downward.
 * - `arrowPointingLeftLines`: Represents an arrow icon pointing leftward.
 * - `arrowPointingRightLines`: Represents an arrow icon pointing rightward.
 * - `arrowPointingUpRightLines`: Represents an arrow icon pointing upward and to the right.
 * - `arrowPointingUpLines`: Represents an arrow icon pointing upward.
 * - `asteriskLines`: Represents an asterisk icon.
 * - `checkMarkLines`: Represents a checkmark icon.
 * - `chevronPointingDownLines`: Represents a chevron icon pointing downward.
 * - `chevronPointingLeftLines`: Represents a chevron icon pointing leftward.
 * - `chevronPointingRightLines`: Represents a chevron icon pointing rightward.
 * - `chevronPointingUpLines`: Represents a chevron icon pointing upward.
 * - `doubleLines`: Represents a double-line icon.
 * - `externalLinkLines`: Represents an icon indicating an external link.
 * - `filterLines`: Represents an icon indicating a filter.
 * - `firstPageLines`: Represents an icon for navigating to the first page.
 * - `firstPagePointingUpLines`: Represents a variation of the first-page icon with an upward orientation.
 * - `gridLines`: Represents an icon indicating a grid structure.
 * - `infoLines`: Represents an icon for informational content.
 * - `kebabMenuLines`: Represents a kebab menu icon.
 * - `lastPageLines`: Represents an icon for navigating to the last page.
 * - `lastPagePointingDownLines`: Represents a variation of the last-page icon with a downward orientation.
 * - `plusLines`: Represents a plus (+) icon.
 * - `singleLine`: Represents a single horizontal line icon.
 * - `stopSquareLines`: Represents a stop square icon.
 * - `trianglePointingDownLines`: Represents a triangle icon pointing down.
 * - `trianglePointingRightLines`: Represents a triangle icon pointing right.
 * - `trianglePointingUpLines`: Represents a triangle icon pointing upward.
 * - `tripleLines`: Represents a triple-line icon.
 * - `verticalDoubleLines`: Represents a vertical double-line icon.
 * - `verticalTripleLines`: Represents a vertical triple-line icon.
 * - `vertialSingleLine`: Represents a single vertical line icon.
 * - `xLines`: Represents an X-shaped icon.
 *
 * The `LineSegment` objects comprising each array define the individual segments that make up the respective icon's shape.
 */
export const lineIcons = new Map<string, LineSegment[]>([
  ['arrowPointingDownLines', arrowPointingDownLines],
  ['arrowPointingLeftLines', arrowPointingLeftLines],
  ['arrowPointingRightLines', arrowPointingRightLines],
  ['arrowPointingUpRightLines', arrowPointingUpRightLines],
  ['arrowPointingUpLines', arrowPointingUpLines],
  ['arrowPointingUpRightLines', arrowPointingUpRightLines],
  ['asteriskLines', asteriskLines],
  ['checkMarkLines', checkMarkLines],
  ['chevronPointingDownLines', chevronPointingDownLines],
  ['chevronPointingLeftLines', chevronPointingLeftLines],
  ['chevronPointingRightLines', chevronPointingRightLines],
  ['chevronPointingUpLines', chevronPointingUpLines],
  ['doubleLines', doubleLines],
  ['externalLinkLines', externalLinkLines],
  ['filterLines', filterLines],
  ['firstPageLines', firstPageLines],
  ['firstPagePointingUpLines', firstPagePointingUpLines],
  ['gridLines', gridLines],
  ['infoLines', infoLines],
  ['kebabMenuLines', kebabMenuLines],
  ['lastPageLines', lastPageLines],
  ['lastPagePointingDownLines', lastPagePointingDownLines],
  ['plusLines', plusLines],
  ['singleLine', singleLine],
  ['stopSquareLines', stopSquareLines],
  ['trianglePointingDownLines', trianglePointingDownLines],
  ['trianglePointingRightLines', trianglePointingRightLines],
  ['trianglePointingUpLines', trianglePointingUpLines],
  ['tripleLines', tripleLines],
  ['verticalDoubleLines', verticalDoubleLines],
  ['verticalTripleLines', verticalTripleLines],
  ['vertialSingleLine', verticalSingleLine],
  ['xLines', xLines],
]);
