import { describe, expect, it } from 'vitest';
import { isEmpty } from '../is-empty';

describe('isEmpty', () => {
  it('should be empty', () => {
    expect(isEmpty('')).toBeTruthy();
    expect(isEmpty([])).toBeTruthy();
    expect(isEmpty({})).toBeTruthy();
    expect(isEmpty(null)).toBeTruthy();
    expect(isEmpty(undefined)).toBeTruthy();
    expect(isEmpty(new Map())).toBeTruthy();
    expect(isEmpty(new Set())).toBeTruthy();
  });

  it('should not be empty', () => {
    expect(isEmpty(' ')).toBeFalsy();
    expect(isEmpty('Hello')).toBeFalsy();
    expect(isEmpty(new Date('2025-12-12T08:00:00.000Z'))).toBeFalsy();
    expect(isEmpty(new Set<string>('Abc'))).toBeFalsy();
    expect(isEmpty(new Map<string, string>([['Hello', 'World']]))).toBeFalsy();
    expect(isEmpty(true)).toBeFalsy();
    expect(isEmpty(false)).toBeFalsy();
    expect(isEmpty(-1)).toBeFalsy();
    expect(isEmpty(0)).toBeFalsy();
    expect(isEmpty(1)).toBeFalsy();
  });
});
