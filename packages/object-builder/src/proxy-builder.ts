import { type AtomicObject, isAtomic, isRecord } from '@olsen-mono/core-utils';
import { deepMerge } from './utils.ts';
import type { DeepPartial } from './types.ts';

/**
 * A utility type that recursively makes all properties of a type non-optional
 * and excludes `null` and `undefined` from all properties, deeply.
 *
 * It operates differently depending on the type of `T`:
 *
 * - For atomic types (e.g., strings, numbers, etc.), it excludes `null` and `undefined`.
 * - For arrays, it recursively applies the transformation to each element in the array while maintaining the array's general structure.
 * - For objects, it recursively applies the transformation to each property of the object, making them required and excluding `null` and `undefined`.
 *
 * This type is useful for ensuring that a deeply nested type has no `null` or `undefined` values, making all properties and nested properties mandatory.
 *
 * @template T The type to be transformed into a deeply required, non-nullable type.
 */
export type DeepRequired<T> = T extends AtomicObject
  ? Exclude<T, null | undefined>
  : T extends readonly unknown[]
    ? {
        [K in keyof T]: DeepRequired<Exclude<T[K], null | undefined>>;
      }
    : T extends object
      ? { [K in keyof T]-?: DeepRequired<Exclude<T[K], null | undefined>> }
      : Exclude<T, null | undefined>;

const RAW_STATE = Symbol('RAW_STATE');

/**
 * Recursively unwraps the provided value. If the value is a proxy, it extracts its raw state.
 * For objects or arrays, the method will recursively process and return their unwrapped equivalents.
 * For atomic values or null/undefined, it returns the value as-is.
 *
 * @param {unknown} val - The value to be unwrapped. It can be of any type, including primitives,
 *   objects, arrays, or proxies.
 * @return {unknown} - The unwrapped version of the input value. Objects and arrays will be recursively
 *   unwrapped, while atomic values or null/undefined will remain unchanged.
 */
function unwrap(val: unknown): unknown {
  if (val == null || typeof val !== 'object' || isAtomic(val)) {
    return val;
  }

  const raw = (val as Record<PropertyKey, unknown>)[RAW_STATE] ?? val;

  if (Array.isArray(raw)) {
    return raw.map(unwrap);
  }

  const result: Record<PropertyKey, unknown> = {};
  if (isRecord(raw)) {
    for (const key of Object.keys(raw)) {
      result[key] = unwrap(raw[key]);
    }
  }
  return result;
}

/**
 * A utility type to create and manage complex proxy objects,
 * allowing chained operations, state validation, and controlled building of final objects.
 *
 * @template T - The type of the object being proxied.
 * @property {function(): T} build - Finalizes and returns the complete object of type `T`.
 * @property {function((state: T) => void): T} peek - Allows inspection of the current state of the proxy object.
 *   Optionally accepts a validator function to perform custom validation or actions on the current state.
 * @property {function(DeepPartial<T>): ProxyBuilder<T>} merge - Merges the provided partial object into the proxy's state.
 */
export type ProxyBuilder<T extends object> = DeepRequired<T> & {
  build(): T;
  peek(validator?: (state: T) => void): T;
  merge(partial: DeepPartial<T>): ProxyBuilder<T>;
};

/**
 * Creates a proxy builder that allows for safe deep mutations, merging, and state inspection of an object.
 *
 * @template T - The type of the object being proxied.
 * @param {DeepPartial<T>} initialObj - The initial partial object to serve as the base for the proxy builder.
 * @return {ProxyBuilder<T>} A proxy object providing functionality to build, peek, and merge state while
 *   maintaining immutability guarantees.
 *
 */
export function createProxyBuilder<T extends object>(initialObj: DeepPartial<T>): ProxyBuilder<T> {
  const state = structuredClone(initialObj) as Record<PropertyKey, unknown>;

  const createVirtualProxy = (target: Record<PropertyKey, unknown>, path: PropertyKey[]): unknown => {
    return new Proxy(
      {},
      {
        get: (_, prop) => {
          if (prop === Symbol.toPrimitive || prop === 'toString' || prop === 'valueOf') {
            return undefined;
          }
          if (typeof prop !== 'string' && typeof prop !== 'number') return undefined;

          return createVirtualProxy(target, [...path, prop]);
        },
        set: (_, prop, value) => {
          if (typeof prop !== 'string' && typeof prop !== 'number') return false;

          let curr = target;
          for (const segment of path) {
            const next = curr[segment];
            if (!isRecord(next)) {
              curr[segment] = {};
            }
            curr = curr[segment] as Record<PropertyKey, unknown>;
          }
          curr[prop] = value;
          return true;
        },
        deleteProperty: (_, prop) => {
          if (typeof prop !== 'string' && typeof prop !== 'number') return false;

          let curr = target;
          for (const segment of path) {
            const next = curr[segment];
            if (!isRecord(next)) return true;
            curr = next;
          }

          if (Array.isArray(curr)) {
            const idx = Number(prop);
            if (!isNaN(idx)) {
              curr.splice(idx, 1);
              return true;
            }
          }

          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete curr[prop];
          return true;
        },
      },
    );
  };

  const handler: ProxyHandler<Record<PropertyKey, unknown>> = {
    get(obj, prop) {
      if (prop === RAW_STATE) return obj;

      if (prop === 'build') {
        return () => structuredClone(unwrap(state)) as T;
      }

      if (prop === 'peek') {
        return (validator?: (s: T) => void) => {
          if (validator) validator(state as unknown as T);
          return state as unknown as T;
        };
      }

      if (prop === 'merge') {
        return (partial: DeepPartial<T>) => {
          deepMerge(state, structuredClone(partial) as Record<string, unknown>);
          return proxy;
        };
      }

      if (typeof prop !== 'string' && typeof prop !== 'number') {
        return obj[prop];
      }

      const value = obj[prop];

      if (value !== undefined && value !== null && isAtomic(value)) {
        return value;
      }

      if (!(prop in obj) || value === undefined || value === null) {
        return createVirtualProxy(obj, [prop]);
      }

      return isRecord(value) || Array.isArray(value)
        ? new Proxy(value as Record<PropertyKey, unknown>, handler)
        : value;
    },

    set(obj, prop, value) {
      if (typeof prop !== 'string' && typeof prop !== 'number') return false;
      obj[prop] = value;
      return true;
    },

    deleteProperty(obj, prop) {
      if (typeof prop !== 'string' && typeof prop !== 'number') return false;

      if (Array.isArray(obj)) {
        const idx = Number(prop);
        if (!isNaN(idx)) {
          obj.splice(idx, 1);
          return true;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete obj[prop];
      return true;
    },
  };

  const proxy = new Proxy(state, handler) as unknown as ProxyBuilder<T>;
  return proxy;
}
