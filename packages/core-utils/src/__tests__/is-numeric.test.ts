import { describe, expect, it } from 'vitest';
import { isNumeric } from '../is-numeric';

describe('isNumeric', () => {
  it('should be numeric', () => {
    expect(isNumeric('0')).toBeTruthy();
    expect(isNumeric(0)).toBeTruthy();
    expect(isNumeric('0.0')).toBeTruthy();
    expect(isNumeric(0.0)).toBeTruthy();
    expect(isNumeric('.0')).toBeTruthy();
    expect(isNumeric('0.')).toBeTruthy();
    expect(isNumeric(-1)).toBeTruthy();
    expect(isNumeric(-1.5)).toBeTruthy();
    expect(isNumeric('-1.5')).toBeTruthy();
    expect(isNumeric(6e6)).toBeTruthy();
    expect(isNumeric('6e6')).toBeTruthy();
    expect(isNumeric('0xff')).toBe(true);
    expect(isNumeric(3000000000)).toBe(true);
    expect(isNumeric(42n)).toBe(true);
    expect(isNumeric(0n)).toBe(true);
    expect(isNumeric(-100n)).toBe(true);
  });

  it('should not be numeric', () => {
    expect(isNumeric('')).toBeFalsy();
    expect(isNumeric(' ')).toBeFalsy();
    expect(isNumeric('1,5')).toBeFalsy();
    expect(isNumeric('gaksi')).toBeFalsy();
    expect(isNumeric('\n')).toBeFalsy();
    expect(isNumeric('\t')).toBeFalsy();
    expect(isNumeric(null)).toBeFalsy();
    expect(isNumeric(undefined)).toBeFalsy();
    expect(isNumeric({})).toBeFalsy();
    expect(isNumeric([])).toBeFalsy();
    expect(isNumeric([1, 2])).toBeFalsy();
    expect(isNumeric(['yksi', 'gaksi'])).toBeFalsy();
    expect(isNumeric('1a')).toBeFalsy();
    expect(isNumeric('2 gaxi')).toBeFalsy();
    expect(isNumeric('kolme 3')).toBeFalsy();
    expect(isNumeric([1])).toBeFalsy();
    expect(isNumeric({ a: 1 })).toBeFalsy();
    expect(isNumeric(NaN)).toBeFalsy();
    expect(isNumeric(Infinity)).toBeFalsy();
    expect(isNumeric(-Infinity)).toBeFalsy();
    expect(isNumeric(true)).toBeFalsy();
    expect(isNumeric(false)).toBeFalsy();
    expect(isNumeric(new Date('2025-12-12T08:00:00.000Z'))).toBeFalsy();
    expect(isNumeric(new Map())).toBeFalsy();
    expect(isNumeric(new Set())).toBeFalsy();
  });
});
