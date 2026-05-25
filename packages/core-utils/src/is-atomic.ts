import { type TemporalObject, isTemporal } from './is-temporal';

/**
 * Represents a composite type that encapsulates various unique "atomic" objects within JavaScript or TypeScript.
 * These objects are either intrinsic to JavaScript or part of newer specifications, each serving specialized purposes.
 * The `AtomicObject` type is a union of several foundational structures and utilities often used for handling complex data,
 * time management, and memory-sensitive constructs.
 *
 * The supported types include:
 * - Date: Used for handling date and time.
 * - Error: Represents runtime errors.
 * - RegExp: Provides functionality for regular expression pattern matching.
 * - ArrayBuffer: Represents a generic, fixed-length raw binary data buffer.
 * - DataView: Provides a low-level interface for reading and writing multiple number types in an `ArrayBuffer` irrespective of the platform's endianness.
 * - Set: A collection of unique values of any type.
 * - Map: Represents a collection of key-value pairs where keys can be any type.
 * - WeakSet: A collection of objects with weak references.
 * - WeakMap: A collection of key-value pairs where keys are objects with weak references.
 * - ArrayBufferView: A type representing views (`TypedArray` and `DataView`) over an `ArrayBuffer` (including `Uint8Array`, `Int32Array`, `DataView`, etc.).
 * - TemporalObject: A placeholder for objects introduced as part of the `Temporal` API, such as `Temporal.Instant`, `Temporal.ZonedDateTime`, etc.
 */
export type AtomicObject =
  | Date
  | Error
  | RegExp
  | ArrayBuffer
  | DataView
  | Set<unknown>
  | Map<unknown, unknown>
  | WeakSet<object>
  | WeakMap<object, unknown>
  | ArrayBufferView
  | TemporalObject;

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
