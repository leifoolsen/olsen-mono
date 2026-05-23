import { isPlainObject } from './is-plain-object';
import { isTemporal } from './is-temporal';

/**
 * Represents an "empty" type which encompasses various values and structures that are considered empty.
 *
 * This type union includes:
 * - An empty string (`''`).
 * - A readonly array with no elements.
 * - A `null` value.
 * - An `undefined` value.
 * - An empty `Map`.
 * - An empty `Set`.
 * - An empty `WeakMap`.
 * - An empty `WeakSet`.
 * - An object with no properties (e.g., `{}` or `Record<PropertyKey, never>`).
 *
 * It is commonly used to define a type that accepts values that are conceptually empty across different data structures.
 */
type Empty =
  | ''
  | readonly unknown[]
  | null
  | undefined
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Record<PropertyKey, never>;

/**
 * Checks whether a given value is considered empty.
 *
 * A value is considered empty if:
 * - It is `null` or `undefined`.
 * - It is a string or array with a length of 0.
 * - It is a `Map` or `Set` with a size of 0.
 * - It is a `WeakMap` or `WeakSet` (always considered empty).
 * - It is a `Date` object with an invalid time value (`NaN`).
 * - It is a plain object with no enumerable keys or symbols.
 *
 * For objects with custom data structures (e.g., `Temporal`), additional checks may apply.
 *
 * @param val The value to be checked.
 * @returns `true` if the value is considered empty, otherwise `false`.
 */
export const isEmpty = (val: unknown): val is Empty => {
  if (val == null) {
    return true;
  }

  if (typeof val === 'string' || Array.isArray(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (val instanceof WeakMap || val instanceof WeakSet) {
    return true;
  }

  if (val instanceof Date) {
    return Number.isNaN(val.getTime());
  }

  if (isTemporal(val)) {
    return false;
  }

  if (isPlainObject(val)) {
    return Reflect.ownKeys(val).length === 0;
  }

  return false;
};
