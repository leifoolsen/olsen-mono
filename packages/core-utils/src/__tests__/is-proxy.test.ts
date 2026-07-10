import * as util from 'node:util';
import { describe, expect, it, vi } from 'vitest';
import { isProxy } from '../is-proxy';

// We mock node:util to control the native isProxy behavior in tests
vi.mock('node:util', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('node:util')>();
  return {
    ...actual,
    types: {
      ...actual.types,
      isProxy: vi.fn(), // We'll define behavior inside tests
    },
  };
});

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

    it('should return true if node:util identifies it as a proxy', () => {
      const target = { name: 'Arendal' };
      const proxy = new Proxy(target, {});

      vi.mocked(util.types.isProxy).mockReturnValue(true);

      expect(isProxy(proxy)).toBe(true);
    });

    it('should return false for regular objects', () => {
      const obj = { a: 1 };
      vi.mocked(util.types.isProxy).mockReturnValue(false);

      expect(isProxy(obj)).toBe(false);
    });
  });

  describe('Browser environment (marker detection)', () => {
    it('should detect a proxy using the __isProxy marker', () => {
      vi.mocked(util.types.isProxy).mockReturnValue(false);

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
  });
});
