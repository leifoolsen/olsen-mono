import type { LineSegment } from './types';

/**
 * Max number of line segments allowed in a single array.
 */
export const MAX_LINE_SEGMENTS = 32;

const toFinite = (value: number, fallback: number): number => (Number.isFinite(value) ? value : fallback);

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
  const safeFactor = Number.isFinite(factor) ? factor : 0.75;

  return lines.map((line) => ({
    x1: center + (toFinite(line.x1, center) - center) * safeFactor,
    y1: center + (toFinite(line.y1, center) - center) * safeFactor,
    x2: center + (toFinite(line.x2, center) - center) * safeFactor,
    y2: center + (toFinite(line.y2, center) - center) * safeFactor,
  }));
}

/** Zero-length point at the center of the 24x24 grid, used to pad line arrays of unequal length. */
const CENTER_POINT: LineSegment = { x1: 12, y1: 12, x2: 12, y2: 12 };

/**
 * Pads an array of line segments with center points until it reaches the given length.
 *
 * @param lines - The line segments to pad.
 * @param length - The desired length of the returned array.
 * @return A new array of line segments with at least `length` items.
 */
export function padLines(lines: LineSegment[], length: number): LineSegment[] {
  const padding = Array.from({ length: Math.max(0, length - lines.length) }, () => ({ ...CENTER_POINT }));
  return [...lines, ...padding];
}

/**
 * Reverses the direction of a line segment by swapping its endpoints.
 *
 * @param line - The line segment to reverse.
 * @return A new line segment with swapped endpoints.
 */
export function reverseLine(line: LineSegment): LineSegment {
  return { x1: line.x2, y1: line.y2, x2: line.x1, y2: line.y1 };
}

/**
 * Calculates the sum of the distances between corresponding endpoints of two line segments.
 *
 * @param a - The first line segment.
 * @param b - The second line segment.
 * @return The distance from a's start to b's start plus the distance from a's end to b's end.
 */
export function endpointDistance(a: LineSegment, b: LineSegment): number {
  return Math.hypot(a.x1 - b.x1, a.y1 - b.y1) + Math.hypot(a.x2 - b.x2, a.y2 - b.y2);
}

/**
 * Calculates the distance between two line segments, independent of their direction. Unlike comparing centers,
 * this takes both position, orientation and length into account.
 *
 * @param a - The first line segment.
 * @param b - The second line segment.
 * @return The smallest endpoint distance of `b` and reversed `b` to `a`.
 */
export function lineDistance(a: LineSegment, b: LineSegment): number {
  return Math.min(endpointDistance(a, b), endpointDistance(a, reverseLine(b)));
}

/**
 * Orients the `to` line segment so its endpoints are closest to the endpoints of the `from` line segment. This
 * prevents visually identical lines from making a 180° rotation during the morph.
 *
 * @param to - The line segment to orient.
 * @param from - The line segment to orient against.
 * @return Either `to` or `to` reversed.
 */
export function orientLine(to: LineSegment, from: LineSegment): LineSegment {
  const reversed = reverseLine(to);
  return endpointDistance(from, reversed) < endpointDistance(from, to) ? reversed : to;
}

/**
 * Finds the assignment of rows to columns with the lowest total cost using the O(n³) Hungarian algorithm.
 * This algorithm should solve 32–64 line segments in under 0.1 ms.
 *
 * @param cost - A square cost matrix, where cost[row][col] is the cost of assigning row to col.
 * @return An array where result[row] is the column assigned to that row.
 *
 * @note
 * This implementation is based on the Jonker–Volgenant shortest augmenting path formulation algorithm, which is an
 * efficient method for solving the assignment problem. The algorithm works by iteratively improving the assignment
 * until the optimal solution is found.
 * It uses a combination of techniques such as the Hungarian method and the shortest augmenting path algorithm to
 * achieve this, and should be well suited for morphing line segments with a small number, 32 to 64 segments.
 * The Hungarian algorithm should solve n = 20 in < 0.05 ms (8,000 operations).
 */
export function bestAssignment(cost: number[][]): number[] {
  const n = cost.length;
  if (n === 0) return [];

  const u = new Float64Array(n + 1);
  const v = new Float64Array(n + 1);
  const p = new Int32Array(n + 1);
  const way = new Int32Array(n + 1);

  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Float64Array(n + 1).fill(Infinity);
    const used = new Uint8Array(n + 1);

    do {
      used[j0] = 1;
      const i0 = p[j0] ?? 0;
      let delta = Infinity;
      let j1 = 0;

      for (let j = 1; j <= n; j++) {
        if (used[j]) continue;
        const cur = (cost[i0 - 1]?.[j - 1] ?? Infinity) - (u[i0] ?? 0) - (v[j] ?? 0);
        if (cur < (minv[j] ?? Infinity)) {
          minv[j] = cur;
          way[j] = j0;
        }
        if ((minv[j] ?? Infinity) < delta) {
          delta = minv[j] ?? Infinity;
          j1 = j;
        }
      }

      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          const pj = p[j] ?? 0;
          u[pj] = (u[pj] ?? 0) + delta;
          v[j] = (v[j] ?? 0) - delta;
        } else {
          minv[j] = (minv[j] ?? 0) - delta;
        }
      }
      j0 = j1;
    } while ((p[j0] ?? 0) !== 0);

    do {
      const j1 = way[j0] ?? 0;
      p[j0] = p[j1] ?? 0;
      j0 = j1;
    } while (j0 !== 0);
  }

  const assignment = new Array<number>(n);
  for (let j = 1; j <= n; j++) {
    assignment[(p[j] ?? 1) - 1] = j - 1;
  }
  return assignment;
}

type FromToLineSegments = {
  fromLines: LineSegment[];
  toLines: LineSegment[];
};

/**
 * Matches and pairs line segments from two arrays, minimizing the total distance the lines travel during the morph.
 * The shorter array is padded with center points, and each matched `to` line is oriented to rotate as little as
 * possible.
 *
 * @param from - An array of line segments to match from.
 * @param to - An array of line segments to match to.
 * @return An object containing two equally long arrays, `fromLines` and `toLines`, where lines with the same index
 *         are paired.
 * @throws {Error} If the number of line segments exceeds MAX_LINE_SEGMENTS.
 */
export function matchLines(from: LineSegment[], to: LineSegment[]): FromToLineSegments {
  const length = Math.max(from.length, to.length);

  if (length > MAX_LINE_SEGMENTS) {
    throw new Error(`Too many lines to match. There should be no more than ${MAX_LINE_SEGMENTS} line segments.`);
  }

  const fromLines = padLines(from, length);
  const paddedTo = padLines(to, length);

  const cost = fromLines.map((f) => paddedTo.map((t) => lineDistance(f, t)));
  const toLines = bestAssignment(cost).map((col, row) =>
    orientLine(paddedTo[col] ?? CENTER_POINT, fromLines[row] ?? CENTER_POINT),
  );

  return { fromLines, toLines };
}

/** Values needed to render and animate a single line in the MorphLinesIcon. */
export type LineMorph = {
  /** The line to render. Points are widened to a minimum length of 2 for stable rotation. */
  line: LineSegment;
  /** Center of the rendered line, used as transform origin. */
  origin: { x: number; y: number };
  moveX: number;
  moveY: number;
  /** Rotation in degrees, normalized to the range [-180, 180]. */
  angle: number;
  scale: number;
  startOpacity: number;
  targetOpacity: number;
};

/**
 * Checks whether a line segment has zero length.
 *
 * @param line - The line segment to check.
 * @return True if both endpoints are equal.
 */
export function isPoint(line: LineSegment): boolean {
  return line.x1 === line.x2 && line.y1 === line.y2;
}

/**
 * Widens a zero-length line segment horizontally to a length of 2, so it has a defined angle for rotation.
 *
 * @param line - The line segment to widen.
 * @return The widened line segment, or the original line segment if it is not a point.
 */
function widenPoint(line: LineSegment): LineSegment {
  return isPoint(line) ? { ...line, x1: line.x1 - 1, x2: line.x2 + 1 } : line;
}

/**
 * Calculates the transform needed to morph one line segment into another.
 * The algorithm is basically a simple nearest neighbor algorithm, trying every pairing and keeping the one with the
 * lowest total distance gives the best result for any input order. Up to 8 lines, that is at most 40,320 pairings,
 * which is negligible. Above that, the Hungarian algorithm (O(n³)) will be a better option.
 *
 * @param from - The line segment to morph from.
 * @param to - The line segment to morph to.
 * @return The rendered line, its transform origin, and the target translation, rotation, scale, and opacities.
 */
export function computeLineMorph(from: LineSegment, to: LineSegment): LineMorph {
  const f = widenPoint(from);
  const t = widenPoint(to);

  const origin = { x: (f.x1 + f.x2) / 2, y: (f.y1 + f.y2) / 2 };
  const target = { x: (t.x1 + t.x2) / 2, y: (t.y1 + t.y2) / 2 };

  const fromLength = Math.hypot(f.x2 - f.x1, f.y2 - f.y1) || 1;
  const toLength = Math.hypot(t.x2 - t.x1, t.y2 - t.y1);

  const fromAngle = Math.atan2(f.y2 - f.y1, f.x2 - f.x1);
  const toAngle = Math.atan2(t.y2 - t.y1, t.x2 - t.x1);
  let angle = (toAngle - fromAngle) * (180 / Math.PI);
  if (angle > 180) angle -= 360;
  if (angle < -180) angle += 360;

  return {
    line: f,
    origin,
    moveX: target.x - origin.x,
    moveY: target.y - origin.y,
    angle,
    // A target point shrinks to nothing
    scale: isPoint(to) ? 0 : toLength / fromLength,
    startOpacity: isPoint(from) ? 0 : 1,
    targetOpacity: isPoint(to) ? 0 : 1,
  };
}
