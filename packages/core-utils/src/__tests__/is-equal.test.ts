import { describe, expect, it } from 'vitest';
import { isEqual } from '../is-equal';

describe('isEqual', () => {
  describe('primitives and identity', () => {
    it('should return true for identical primitive values', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('hello', 'hello')).toBe(true);
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
    });

    it('should return false for non-identical primitive values', () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual('hello', 'world')).toBe(false);
      expect(isEqual(true, false)).toBe(false);
      expect(isEqual(null, undefined)).toBe(false);
    });

    it('should handle NaN correctly', () => {
      expect(isEqual(NaN, NaN)).toBe(true);
    });

    it('should handle BigInt correctly', () => {
      expect(isEqual(42n, 42n)).toBe(true);
      expect(isEqual(42n, 42)).toBe(false); // Different types
    });
  });

  describe('atomic built-in objects', () => {
    it('should compare Date objects by value', () => {
      const d1 = new Date('2026-05-15T12:00:00.000Z');
      const d2 = new Date('2026-05-15T12:00:00.000Z');
      const d3 = new Date('2026-05-16T12:00:00.000Z');

      expect(isEqual(d1, d2)).toBe(true);
      expect(isEqual(d1, d3)).toBe(false);
    });

    it('should compare RegExp objects by value', () => {
      expect(isEqual(/abc/g, /abc/g)).toBe(true);
      expect(isEqual(/abc/g, /abc/i)).toBe(false);
    });

    it('should compare Temporal objects correctly', () => {
      const t1 = Temporal.PlainDate.from('2026-05-15');
      const t2 = Temporal.PlainDate.from('2026-05-15');
      const t3 = Temporal.PlainDate.from('2026-05-16');

      expect(isEqual(t1, t2)).toBe(true);
      expect(isEqual(t1, t3)).toBe(false);
    });
  });

  describe('collections (Map and Set)', () => {
    it('should compare deeply nested Maps', () => {
      const map1 = new Map([['nested', new Map([['a', 1]])]]);
      const map2 = new Map([['nested', new Map([['a', 1]])]]);
      const map3 = new Map([['nested', new Map([['a', 2]])]]);

      expect(isEqual(map1, map2)).toBe(true);
      expect(isEqual(map1, map3)).toBe(false);
    });

    it('should compare deep Sets', () => {
      const set1 = new Set([{ a: 1 }, { b: 2 }]);
      const set2 = new Set([{ a: 1 }, { b: 2 }]);
      const set3 = new Set([{ a: 1 }, { b: 3 }]);

      expect(isEqual(set1, set2)).toBe(true);
      expect(isEqual(set1, set3)).toBe(false); // -> Denne feiler
    });
  });

  describe('arrays and plain objects', () => {
    it('should compare flat arrays and objects', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true); // Order of keys doesn't matter
    });

    it('should compare deeply nested structures', () => {
      const obj1 = { a: [1, { b: true }], c: { d: 'test' } };
      const obj2 = { a: [1, { b: true }], c: { d: 'test' } };
      const obj3 = { a: [1, { b: false }], c: { d: 'test' } };

      expect(isEqual(obj1, obj2)).toBe(true);
      expect(isEqual(obj1, obj3)).toBe(false);
    });

    it('should handle Symbol keys in objects', () => {
      const sym = Symbol('key');
      const obj1 = { [sym]: 'value' };
      const obj2 = { [sym]: 'value' };
      const obj3 = { [Symbol('key')]: 'value' }; // Unique symbol instance

      expect(isEqual(obj1, obj2)).toBe(true);
      expect(isEqual(obj1, obj3)).toBe(false);
    });
  });

  describe('prototypes and class instances', () => {
    it('should return false for objects with different prototypes', () => {
      class Person {
        constructor(public name: string) {}
      }
      class Animal {
        constructor(public name: string) {}
      }

      const p = new Person('John');
      const a = new Animal('John');

      expect(isEqual(p, a)).toBe(false);
    });

    it('should return false when comparing an array with an object having array-like keys', () => {
      const arr = [1, 2];
      const obj = { '0': 1, '1': 2 };

      expect(isEqual(arr, obj)).toBe(false);
    });
  });
});
