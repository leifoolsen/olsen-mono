import { isTemporal } from './is-temporal';
import type { AtomicObject } from './types.ts';

/**
 * Determines whether the given value is considered atomic.
 * An atomic value is a primitive value (string, number, boolean, symbol, null, undefined)
 * or an object that is treated as a single, indivisible unit such as Date, Error, RegExp,
 * ArrayBuffer, Set, Map, WeakSet, WeakMap, or other view types of ArrayBuffer,
 * including Temporal objects if applicable.
 *
 * @param {unknown} val - The value to check for atomicity.
 * @returns {val is AtomicObject | string | number | boolean | symbol | null | undefined}
 * A boolean indicating whether the provided value is atomic.
 */
export const isAtomic = (val: unknown): val is AtomicObject | string | number | boolean | symbol | null | undefined => {
  if (val == null || typeof val !== 'object') {
    return true;
  }

  return (
    Error.isError(val) ||
    val instanceof Date ||
    isTemporal(val) ||
    val instanceof RegExp ||
    val instanceof ArrayBuffer ||
    val instanceof Set ||
    val instanceof Map ||
    val instanceof WeakSet ||
    val instanceof WeakMap ||
    ArrayBuffer.isView(val)
  );
};
