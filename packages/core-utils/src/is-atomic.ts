import { isPrimitive } from './is-primitive';
import { isTemporal } from './is-temporal';
import type { AtomicValue } from './types';

/**
 * Determines whether the given value is considered atomic.
 * An atomic value is a primitive value (string, number, bigint, boolean, symbol, null, undefined)
 * or an object treated as a single, indivisible unit such as Date, Error, RegExp,
 * ArrayBuffer, Set, Map, WeakSet, WeakMap, or other view types of ArrayBuffer,
 * including Temporal objects if applicable. Functions are not atomic.
 *
 * @param {unknown} val - The value to check for atomicity.
 * @returns {val is AtomicValue} A boolean indicating whether the provided value is atomic.
 */
export const isAtomic = (val: unknown): val is AtomicValue => {
  if (isPrimitive(val)) {
    return true;
  }

  if (typeof val !== 'object') {
    return false;
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
