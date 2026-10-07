import { describe, expect, it } from 'vitest';
import { tripleLines, xLines } from '../line-icons';
import type { LineSegment } from '../types';
import {
  bestAssignment,
  computeLineMorph,
  endpointDistance,
  isPoint,
  lineDistance,
  matchLines,
  orientLine,
  padLines,
  reverseLine,
  scaleLines,
} from '../utils';

const CENTER_POINT: LineSegment = { x1: 12, y1: 12, x2: 12, y2: 12 };
const horizontal = (y: number): LineSegment => ({ x1: 4, y1: y, x2: 20, y2: y });

describe('utils', () => {
  describe('scaleLines', () => {
    it('should scale coordinates towards the center', () => {
      expect(scaleLines([{ x1: 4, y1: 12, x2: 20, y2: 12 }], 0.5)).toEqual([{ x1: 8, y1: 12, x2: 16, y2: 12 }]);
    });

    it('should leave lines unchanged with a factor of 1', () => {
      expect(scaleLines(tripleLines, 1)).toEqual(tripleLines);
    });
  });

  describe('padLines', () => {
    it('should pad with center points up to the given length', () => {
      expect(padLines([horizontal(6)], 3)).toEqual([horizontal(6), CENTER_POINT, CENTER_POINT]);
    });

    it('should not truncate or mutate the input', () => {
      const lines = [horizontal(6), horizontal(12)];
      expect(padLines(lines, 1)).toEqual(lines);
      expect(padLines(lines, 1)).not.toBe(lines);
    });
  });

  describe('reverseLine', () => {
    it('should swap the endpoints', () => {
      expect(reverseLine({ x1: 1, y1: 2, x2: 3, y2: 4 })).toEqual({ x1: 3, y1: 4, x2: 1, y2: 2 });
    });
  });

  describe('endpointDistance and lineDistance', () => {
    it('should be 0 for identical lines', () => {
      expect(endpointDistance(horizontal(6), horizontal(6))).toBe(0);
      expect(lineDistance(horizontal(6), horizontal(6))).toBe(0);
    });

    it('should ignore direction in lineDistance, but not in endpointDistance', () => {
      const line = horizontal(6);
      expect(endpointDistance(line, reverseLine(line))).toBe(32);
      expect(lineDistance(line, reverseLine(line))).toBe(0);
    });

    it('should take orientation into account, not only the center', () => {
      const vertical: LineSegment = { x1: 12, y1: 4, x2: 12, y2: 20 };
      const shiftedHorizontal = horizontal(13);
      // Same center as horizontal(12), but perpendicular
      expect(lineDistance(horizontal(12), vertical)).toBeGreaterThan(lineDistance(horizontal(12), shiftedHorizontal));
    });
  });

  describe('orientLine', () => {
    it('should reverse the target when that brings its endpoints closer', () => {
      const from = horizontal(6);
      expect(orientLine(reverseLine(horizontal(8)), from)).toEqual(horizontal(8));
    });

    it('should keep the target when it is already oriented', () => {
      expect(orientLine(horizontal(8), horizontal(6))).toEqual(horizontal(8));
    });
  });

  describe('bestAssignment', () => {
    it('should return an empty assignment for an empty matrix', () => {
      expect(bestAssignment([])).toEqual([]);
    });

    it('should find the globally cheapest assignment, not the greedy one', () => {
      // Greedy would pick row 0 -> col 0 (1), forcing row 1 -> col 1 (100). Optimal total is 2 + 1 = 3.
      expect(
        bestAssignment([
          [1, 2],
          [1, 100],
        ]),
      ).toEqual([1, 0]);
    });

    it('should return a permutation', () => {
      const cost = [
        [4, 1, 3],
        [2, 0, 5],
        [3, 2, 2],
      ];
      const result = bestAssignment(cost);
      expect([...result].sort()).toEqual([0, 1, 2]);
      expect(result.reduce((sum, col, row) => sum + (cost[row]?.[col] ?? 0), 0)).toBe(5);
    });
  });

  describe('matchLines', () => {
    it('should return equally long arrays, padding the shorter one', () => {
      const { fromLines, toLines } = matchLines([horizontal(12)], tripleLines);
      expect(fromLines).toHaveLength(3);
      expect(toLines).toHaveLength(3);
      expect(fromLines.filter(isPoint)).toHaveLength(2);
    });

    it('should minimize the total distance regardless of input order', () => {
      // Greedy matching from y=10 would take y=8, leaving y=6 to travel all the way to y=14.
      const from = [horizontal(10), horizontal(6)];
      const to = [horizontal(8), horizontal(14)];

      expect(matchLines(from, to).toLines).toEqual([horizontal(14), horizontal(8)]);
      expect(matchLines([...from].reverse(), to).toLines).toEqual([horizontal(8), horizontal(14)]);
    });

    it('should collapse the middle hamburger line into the center point of the X', () => {
      const { fromLines, toLines } = matchLines(tripleLines, xLines);
      const middleIndex = fromLines.findIndex((l) => l.y1 === 12 && l.y2 === 12);

      expect(toLines[middleIndex]).toEqual(CENTER_POINT);
      // The outer lines each go to a separate diagonal
      expect(toLines.filter((l) => !isPoint(l))).toHaveLength(2);
    });

    it('should orient matched lines so they do not flip 180°', () => {
      const { toLines } = matchLines([horizontal(6)], [reverseLine(horizontal(8))]);
      expect(toLines).toEqual([horizontal(8)]);
    });
  });

  describe('computeLineMorph', () => {
    it('should not transform identical lines', () => {
      const morph = computeLineMorph(horizontal(6), horizontal(6));
      expect(morph).toEqual({
        line: horizontal(6),
        origin: { x: 12, y: 6 },
        moveX: 0,
        moveY: 0,
        angle: 0,
        scale: 1,
        startOpacity: 1,
        targetOpacity: 1,
      });
    });

    it('should translate between line centers', () => {
      const morph = computeLineMorph(horizontal(6), horizontal(18));
      expect(morph.moveX).toBe(0);
      expect(morph.moveY).toBe(12);
    });

    it('should rotate and scale between lines of different angle and length', () => {
      const vertical: LineSegment = { x1: 12, y1: 0, x2: 12, y2: 32 };
      const morph = computeLineMorph(horizontal(12), vertical);
      expect(morph.angle).toBeCloseTo(90);
      expect(morph.scale).toBeCloseTo(2);
      expect(morph.moveX).toBe(0);
      expect(morph.moveY).toBe(4);
    });

    it('should normalize the angle to [-180, 180]', () => {
      const from: LineSegment = { x1: 20, y1: 13, x2: 4, y2: 11 }; // almost 180°
      const to: LineSegment = { x1: 20, y1: 11, x2: 4, y2: 13 }; // almost -180°
      const { angle } = computeLineMorph(from, to);
      expect(Math.abs(angle)).toBeLessThan(180);
      expect(Math.abs(angle)).toBeLessThan(20);
    });

    it('should shrink and fade out when morphing to a point', () => {
      const morph = computeLineMorph(horizontal(12), CENTER_POINT);
      expect(morph.scale).toBe(0);
      expect(morph.startOpacity).toBe(1);
      expect(morph.targetOpacity).toBe(0);
    });

    it('should widen a point to a renderable line and start it hidden', () => {
      const morph = computeLineMorph(CENTER_POINT, horizontal(12));
      expect(morph.line).toEqual({ x1: 11, y1: 12, x2: 13, y2: 12 });
      expect(morph.startOpacity).toBe(0);
      expect(morph.targetOpacity).toBe(1);
      expect(morph.scale).toBe(8);
      expect(Number.isFinite(morph.angle)).toBe(true);
    });
  });
});
