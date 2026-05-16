import { describe, expect, it } from 'vitest';
import { isEmpty } from '../is-empty';

describe('isEmpty', () => {
  describe('nullish and primitive values', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return false for non-empty strings and numbers', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe('collections (Arrays, Maps, Sets)', () => {
    it('should evaluate arrays correctly', () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1, 2])).toBe(false);
    });

    it('should evaluate Maps and Sets correctly', () => {
      expect(isEmpty(new Map())).toBe(true);
      expect(isEmpty(new Set())).toBe(true);

      const filledMap = new Map([['key', 'value']]);
      const filledSet = new Set([1]);
      expect(isEmpty(filledMap)).toBe(false);
      expect(isEmpty(filledSet)).toBe(false);
    });

    it('should always return true for WeakMap and WeakSet', () => {
      expect(isEmpty(new WeakMap())).toBe(true);
      expect(isEmpty(new WeakSet())).toBe(true);
    });
  });

  describe('Dates and Temporal', () => {
    it('should return true for invalid legacy Dates', () => {
      expect(isEmpty(new Date('invalid-date'))).toBe(true);
    });

    it('should return false for valid legacy Dates', () => {
      expect(isEmpty(new Date())).toBe(false);
    });

    it('should always return false for Temporal objects', () => {
      const plainDate = Temporal.PlainDate.from('2026-05-15');
      expect(isEmpty(plainDate)).toBe(false);
    });
  });

  describe('Objects and Prototypes', () => {
    it('should return true for empty plain objects', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty plain objects', () => {
      expect(isEmpty({ key: 'value' })).toBe(false);
    });

    it('should handle prototype-less objects correctly', () => {
      const noProtoEmpty = Object.create(null) as Record<string, unknown>;
      expect(isEmpty(noProtoEmpty)).toBe(true);

      const noProtoFilled = Object.create(null) as { id: number };
      noProtoFilled.id = 1;
      expect(isEmpty(noProtoFilled)).toBe(false);
    });

    it('should return false for class instances even if they have no unique keys', () => {
      class User {
        name?: string;
      }
      const userInstance = new User();
      expect(isEmpty(userInstance)).toBe(false);
    });

    it('should return false for objects containing only Symbol keys', () => {
      const sym = Symbol('id');
      const objWithSymbol = { [sym]: 'secret' };
      expect(isEmpty(objWithSymbol)).toBe(false);
    });

    it('should return false for objects with non-enumerable properties', () => {
      const obj = {};
      Object.defineProperty(obj, 'hidden', {
        value: 'hidden-value',
        enumerable: false, // Skjult for Object.keys, men eksisterer
      });
      expect(isEmpty(obj)).toBe(false);
    });
  });
});
