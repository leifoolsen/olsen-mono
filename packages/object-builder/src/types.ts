import type { AtomicObject } from '@olsen-mono/core-utils';

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
      : T extends readonly any[] // eslint-disable-line @typescript-eslint/no-explicit-any
        ? number extends T['length']
          ? DeepPartial<T[number]>[]
          : { [K in keyof T]: DeepPartial<T[K]> }
        : T extends object
          ? { [K in keyof T]?: DeepPartial<T[K]> }
          : T;
