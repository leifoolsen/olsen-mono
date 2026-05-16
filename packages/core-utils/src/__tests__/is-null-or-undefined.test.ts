import { describe, expect, it } from 'vitest';
import { isNullOrUndefined } from '../is-null-or-undefined';

describe('isNullOrDefined', () => {
  it('should not be null or undefined', () => {
    expect(isNullOrUndefined('')).toBeFalsy();
    expect(isNullOrUndefined('Hello')).toBeFalsy();
    expect(isNullOrUndefined([])).toBeFalsy();
    expect(isNullOrUndefined({})).toBeFalsy();
    expect(isNullOrUndefined(new Date('2025-12-12T08:00:00.000Z'))).toBeFalsy();
    expect(isNullOrUndefined(new Map())).toBeFalsy();
    expect(isNullOrUndefined(new Set())).toBeFalsy();
  });

  it('should be null or undefined', () => {
    expect(isNullOrUndefined(null)).toBeTruthy();
    expect(isNullOrUndefined(undefined)).toBeTruthy();
  });
});
