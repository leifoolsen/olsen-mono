/**
 * Represents the coordinates of a line in a 2D space.
 *
 * This type defines a line segment by specifying the coordinates of its two endpoints.
 *
 * Properties:
 * - `x1` - The x-coordinate of the starting point of the line.
 * - `y1` - The y-coordinate of the starting point of the line.
 * - `x2` - The x-coordinate of the ending point of the line.
 * - `y2` - The y-coordinate of the ending point of the line.
 */
export type LineSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

/**
 * Represents an API for morphing lines between two sets of line segments.
 *
 * This type defines an interface for setting the "from" and "to" line segments,
 * which are used to create a morphing animation between them.
 *
 * Properties:
 * - `setFromToLines` - A function that takes two arrays of `LineSegment` objects
 *                       representing the "from" and "to" line segments, respectively.
 *                       It sets these line segments for the morphing animation.
 */
export type MorphLinesIconApi = {
  setFromToLines: (fromLines: LineSegment[], toLines: LineSegment[]) => void;
};
