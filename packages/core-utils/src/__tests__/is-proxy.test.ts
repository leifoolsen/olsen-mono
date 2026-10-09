import { describe, expect, it } from 'vitest';
import { isProxy } from '../is-proxy';

describe('isProxy', () => {
  describe('Node.js environment (native detection)', () => {
    it('should return true for objects with the custom __isProxy fallback property', () => {
      const customProxy = { __isProxy: true as const };

      expect(isProxy(customProxy)).toBe(true);
    });

    it('should return false for plain objects and primitives', () => {
      expect(isProxy({})).toBe(false);
      expect(isProxy(null)).toBe(false);
      expect(isProxy(undefined)).toBe(false);
      expect(isProxy('not a proxy')).toBe(false);
      expect(isProxy({ __isProxy: false })).toBe(false);
    });

    it('should return true for a native proxy without a marker', () => {
      const proxy = new Proxy({ name: 'Arendal' }, {});

      expect(isProxy(proxy)).toBe(true);
    });

    it('should return true for a proxied function', () => {
      const proxy = new Proxy(() => undefined, {});

      expect(isProxy(proxy)).toBe(true);
    });

    it('should return false for regular objects', () => {
      expect(isProxy({ a: 1 })).toBe(false);
      expect(isProxy(() => undefined)).toBe(false);
    });
  });

  describe('Browser environment (marker detection)', () => {
    it('should detect a proxy using the __isProxy marker', () => {
      const handler = {
        // biome-ignore lint/suspicious/noExplicitAny: any is fine here
        get(target: any, prop: string | symbol) {
          if (prop === '__isProxy') return true;
          return target[prop];
        },
      };

      const proxy = new Proxy({ name: 'test' }, handler);
      expect(isProxy(proxy)).toBe(true);
    });

    it('should return false if the marker is missing', () => {
      const normalObj = { name: 'test' };
      expect(isProxy(normalObj)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle null or undefined gracefully', () => {
      expect(isProxy(null)).toBe(false);
      expect(isProxy(undefined)).toBe(false);
    });

    it('should not throw if the target object is frozen', () => {
      const frozen = Object.freeze({});
      expect(() => isProxy(frozen)).not.toThrow();
    });

    it('should not throw if a proxy get trap throws', () => {
      const proxy = new Proxy(
        {},
        {
          get() {
            throw new Error('boom');
          },
        },
      );
      expect(() => isProxy(proxy)).not.toThrow();
    });
  });
});
