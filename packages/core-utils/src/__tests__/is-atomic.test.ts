import { describe, expect, it } from 'vitest';
import { isAtomic } from '../is-atomic';

describe('isAtomic', () => {
  it('should return true for all primitives and atomic objects', () => {
    // Primitiver
    expect(isAtomic(42)).toBe(true);
    expect(isAtomic('hei')).toBe(true);
    expect(isAtomic(Symbol('test'))).toBe(true);
    expect(isAtomic(null)).toBe(true);

    // Standard innebygde objekter
    expect(isAtomic(new Date())).toBe(true);
    expect(isAtomic(new Error())).toBe(true);
    expect(isAtomic(/regex/)).toBe(true);

    // Samlinger og Buffere
    expect(isAtomic(new Set())).toBe(true);
    expect(isAtomic(new Map())).toBe(true);
    expect(isAtomic(new WeakMap())).toBe(true);
    expect(isAtomic(new Int32Array([1, 2]))).toBe(true); // ArrayBufferView

    // Moderne Temporal-objekter (Støttet native i Node 26)
    expect(isAtomic(Temporal.Now.plainDateISO())).toBe(true);
    expect(isAtomic(Temporal.Duration.from({ hours: 2 }))).toBe(true);
  });

  it('should return false for plain objects and arrays', () => {
    expect(isAtomic({})).toBe(false);
    expect(isAtomic([])).toBe(false);
    expect(isAtomic(Object.create(null))).toBe(false);
  });
});
