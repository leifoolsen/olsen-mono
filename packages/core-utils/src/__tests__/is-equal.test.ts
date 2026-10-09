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

  describe('binary data', () => {
    it('should compare ArrayBuffers by content', () => {
      expect(isEqual(new Uint8Array([1, 2]).buffer, new Uint8Array([1, 2]).buffer)).toBe(true);
      expect(isEqual(new ArrayBuffer(1), new ArrayBuffer(8))).toBe(false);
      expect(isEqual(new Uint8Array([1]).buffer, new Uint8Array([2]).buffer)).toBe(false);
    });

    it('should compare typed arrays by type and content', () => {
      expect(isEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2]))).toBe(true);
      expect(isEqual(new Uint8Array([1, 2]), new Uint8Array([1, 3]))).toBe(false);
      expect(isEqual(new Uint8Array([1, 2]), new Int8Array([1, 2]))).toBe(false);
    });

    it('should only compare the viewed region of a typed array', () => {
      const buffer = new Uint8Array([9, 1, 2, 9]).buffer;
      expect(isEqual(new Uint8Array(buffer, 1, 2), new Uint8Array([1, 2]))).toBe(true);
    });

    it('should compare DataViews by content', () => {
      expect(isEqual(new DataView(new Uint8Array([1]).buffer), new DataView(new Uint8Array([1]).buffer))).toBe(true);
      expect(isEqual(new DataView(new Uint8Array([1]).buffer), new DataView(new Uint8Array([2]).buffer))).toBe(false);
    });
  });

  describe('other built-ins', () => {
    it('should treat two invalid Dates as equal', () => {
      expect(isEqual(new Date(NaN), new Date(NaN))).toBe(true);
      expect(isEqual(new Date(NaN), new Date(0))).toBe(false);
    });

    it('should compare Errors by message and cause, ignoring stack', () => {
      expect(isEqual(new Error('x', { cause: 1 }), new Error('x', { cause: 1 }))).toBe(true);
      expect(isEqual(new Error('x', { cause: 1 }), new Error('x', { cause: 2 }))).toBe(false);
      expect(isEqual(new Error('x'), new Error('y'))).toBe(false);
      expect(isEqual(new Error('x'), new TypeError('x'))).toBe(false);
    });

    it('should compare boxed primitives by value', () => {
      expect(isEqual(new Number(1), new Number(1))).toBe(true);
      expect(isEqual(new Number(1), new Number(2))).toBe(false);
      expect(isEqual(new Boolean(true), new Boolean(false))).toBe(false);
      expect(isEqual(new Number(1), 1)).toBe(false);
    });

    it('should compare opaque objects by identity only', () => {
      const weakMap = new WeakMap();
      expect(isEqual(weakMap, weakMap)).toBe(true);
      expect(isEqual(new WeakMap(), new WeakMap())).toBe(false);
      expect(isEqual(new WeakSet(), new WeakSet())).toBe(false);
      expect(isEqual(Promise.resolve(1), Promise.resolve(1))).toBe(false);
    });

    it('should compare functions by identity only', () => {
      const fn = () => 1;
      expect(isEqual(fn, fn)).toBe(true);
      expect(isEqual(fn, () => 1)).toBe(false);
    });

    it('should not consider a Map equal to a Set', () => {
      expect(isEqual(new Map(), new Set())).toBe(false);
    });

    it.runIf(typeof Temporal !== 'undefined')('should compare Temporal.Duration field by field', () => {
      expect(isEqual(Temporal.Duration.from({ hours: 1 }), Temporal.Duration.from({ hours: 1 }))).toBe(true);
      expect(isEqual(Temporal.Duration.from({ milliseconds: 1000 }), Temporal.Duration.from({ seconds: 1 }))).toBe(
        false,
      );
    });
  });

  describe('collections with mixed keys', () => {
    it('should match object keys in Maps structurally', () => {
      const map1 = new Map<unknown, number>([
        ['a', 1],
        [{ id: 1 }, 2],
      ]);
      const map2 = new Map<unknown, number>([
        [{ id: 1 }, 2],
        ['a', 1],
      ]);
      const map3 = new Map<unknown, number>([
        ['a', 1],
        [{ id: 2 }, 2],
      ]);

      expect(isEqual(map1, map2)).toBe(true);
      expect(isEqual(map1, map3)).toBe(false);
    });

    it('should not match duplicate structural items more than once in Sets', () => {
      expect(isEqual(new Set([{ a: 1 }, { a: 1 }]), new Set([{ a: 1 }, { a: 2 }]))).toBe(false);
      expect(isEqual(new Set([1, 'a']), new Set([1, 'b']))).toBe(false);
    });
  });

  describe('cyclic references', () => {
    it('should compare self-referencing objects without overflowing the stack', () => {
      // biome-ignore lint/suspicious/noExplicitAny: any is fine here
      const a: any = { name: 'a' };
      a.self = a;
      // biome-ignore lint/suspicious/noExplicitAny: any is fine here
      const b: any = { name: 'a' };
      b.self = b;
      // biome-ignore lint/suspicious/noExplicitAny: any is fine here
      const c: any = { name: 'c' };
      c.self = c;

      expect(isEqual(a, b)).toBe(true);
      expect(isEqual(a, c)).toBe(false);
    });

    it('should compare mutually referencing structures', () => {
      // biome-ignore lint/suspicious/noExplicitAny: any is fine here
      const a1: any = {};
      // biome-ignore lint/suspicious/noExplicitAny: any is fine here
      const a2: any = { a1 };
      a1.a2 = a2;
      // biome-ignore lint/suspicious/noExplicitAny: any is fine here
      const b1: any = {};
      // biome-ignore lint/suspicious/noExplicitAny: any is fine here
      const b2: any = { a1: b1 };
      b1.a2 = b2;

      expect(isEqual([a1, a2], [b1, b2])).toBe(true);
    });
  });
});
