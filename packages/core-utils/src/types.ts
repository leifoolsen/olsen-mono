/**
 * A union type representing various Temporal objects.
 *
 * TemporalObject can be one of the following:
 * - Temporal.PlainDate: Represents a calendar date without a time component.
 * - Temporal.PlainTime: Represents a time of day without a date component.
 * - Temporal.PlainDateTime: Represents a calendar date and time of day without a timezone.
 * - Temporal.ZonedDateTime: Represents a calendar date and time of day with a timezone.
 * - Temporal.Duration: Represents a span of time measured in various units.
 * - Temporal.Instant: Represents a fixed instant in time, independent of calendar or time zone.
 * - Temporal.PlainYearMonth: Represents a specific year and month without a day or time component.
 * - Temporal.PlainMonthDay: Represents a specific month and day without a year or time component.
 */
export type TemporalObject =
  | Temporal.PlainDate
  | Temporal.PlainTime
  | Temporal.PlainDateTime
  | Temporal.ZonedDateTime
  | Temporal.Duration
  | Temporal.Instant
  | Temporal.PlainYearMonth
  | Temporal.PlainMonthDay;

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
 * A utility type that recursively makes all properties of a given type `T` optional.
 * This is particularly useful for scenarios where partial updates of deeply nested structures
 * are needed.
 *
 * The type handles several specific cases:
 * - Atomic types and primitive values (e.g., `string`, `number`, `boolean`) remain unchanged.
 * - `Map` and `Set` entries are recursively wrapped in `DeepPartial`.
 * - Arrays and tuples are differentiated:
 *   - For regular arrays, the type applies `DeepPartial` to the array's element type.
 *   - For fixed tuples (where length is a specific number), each member of the tuple
 *     is individually wrapped in `DeepPartial`.
 * - Plain objects are transformed such that each property is optional and recursively processed.
 *
 * @template T The type to be recursively wrapped in `DeepPartial`.
 */
export type DeepPartial<T> = T extends AtomicObject
  ? T
  : T extends Map<infer K, infer V>
    ? Map<K, DeepPartial<V>>
    : T extends Set<infer U>
      ? Set<DeepPartial<U>>
      : // biome-ignore lint/suspicious/noExplicitAny: any is ok here
        T extends readonly any[]
        ? number extends T['length']
          ? DeepPartial<T[number]>[]
          : { [K in keyof T]: DeepPartial<T[K]> }
        : T extends object
          ? { [K in keyof T]?: DeepPartial<T[K]> }
          : T;
