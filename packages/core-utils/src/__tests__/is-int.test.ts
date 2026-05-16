import { describe, expect, it } from 'vitest';
import { isInt } from '../is-int';

describe('isInt', () => {
  it('should be an integer', () => {
    expect(isInt('0')).toBe(true);
    expect(isInt(0)).toBe(true);
    expect(isInt(-1)).toBe(true);
    expect(isInt(1)).toBe(true);
    expect(isInt(6e6)).toBe(true);
    expect(isInt('6e6')).toBe(true);
    expect(isInt('1.5e6')).toBe(true);
    expect(isInt('0xff')).toBe(true);
    expect(isInt(3000000000)).toBe(true);
    expect(isInt(42n)).toBe(true);
    expect(isInt(0n)).toBe(true);
    expect(isInt(-100n)).toBe(true);
  });

  it('should not be an integer', () => {
    expect(isInt('')).toBeFalsy();
    expect(isInt(' ')).toBeFalsy();
    expect(isInt('gaksi')).toBeFalsy();
    expect(isInt('\n')).toBeFalsy();
    expect(isInt('\t')).toBeFalsy();
    expect(isInt(null)).toBeFalsy();
    expect(isInt(undefined)).toBeFalsy();
    expect(isInt({})).toBeFalsy();
    expect(isInt([])).toBeFalsy();
    expect(isInt([1, 2])).toBeFalsy();
    expect(isInt(['yksi', 'gaksi'])).toBeFalsy();
    expect(isInt(-1.5)).toBeFalsy();
    expect(isInt(1.5)).toBeFalsy();
    expect(isInt('-1.5')).toBeFalsy();
    expect(isInt('1.5')).toBeFalsy();
    expect(isInt('1.5a')).toBeFalsy();
    expect(isInt('1a')).toBeFalsy();
    expect(isInt('2 gaxi')).toBeFalsy();
    expect(isInt('kolme 3')).toBeFalsy();
    expect(isInt([1])).toBeFalsy();
    expect(isInt({ a: 1 })).toBeFalsy();
    expect(isInt(NaN)).toBeFalsy();
    expect(isInt(Infinity)).toBeFalsy();
    expect(isInt(-Infinity)).toBeFalsy();
    expect(isInt(true)).toBeFalsy();
    expect(isInt(false)).toBeFalsy();
    expect(isInt(new Date('2025-12-12T08:00:00.000Z'))).toBeFalsy();
    expect(isInt(new Map())).toBeFalsy();
    expect(isInt(new Set())).toBeFalsy();
  });
});
