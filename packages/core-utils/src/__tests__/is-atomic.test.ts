import { describe, expect, expectTypeOf, it } from 'vitest';
import { isAtomic } from '../is-atomic';

describe('isAtomic', () => {
  it('should return true for all primitives and atomic objects', () => {
    expect(isAtomic(42)).toBe(true);
    expect(isAtomic('hei')).toBe(true);
    expect(isAtomic(Symbol('test'))).toBe(true);
    expect(isAtomic(null)).toBe(true);

    expect(isAtomic(new Date())).toBe(true);
    expect(isAtomic(new Error())).toBe(true);
    expect(isAtomic(/regex/)).toBe(true);

    expect(isAtomic(new Set())).toBe(true);
    expect(isAtomic(new Map())).toBe(true);
    expect(isAtomic(new WeakMap())).toBe(true);
    expect(isAtomic(new Int32Array([1, 2]))).toBe(true); // ArrayBufferView

    expect(isAtomic(Temporal.Now.plainDateISO())).toBe(true);
    expect(isAtomic(Temporal.Duration.from({ hours: 2 }))).toBe(true);
  });

  it('should return false for plain objects and arrays', () => {
    expect(isAtomic({})).toBe(false);
    expect(isAtomic([])).toBe(false);
    expect(isAtomic(Object.create(null))).toBe(false);
  });

  it('should return true for bigint values', () => {
    expect(isAtomic(42n)).toBe(true);
  });

  it('should return false for functions and classes', () => {
    expect(isAtomic(() => undefined)).toBe(false);
    expect(isAtomic(function named() {})).toBe(false);
    expect(isAtomic(class {})).toBe(false);
  });

  it('should narrow bigint to atomic and functions to non-atomic', () => {
    const value = 42n as bigint | (() => void) | { a: number };

    if (isAtomic(value)) {
      expectTypeOf(value).toEqualTypeOf<bigint>();
    } else {
      expectTypeOf(value).toEqualTypeOf<(() => void) | { a: number }>();
    }
  });
});
