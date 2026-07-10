import type { AtomicObject, DeepPartial } from '@olsen-mono/core-utils';
import { isAtomic, isRecord } from '@olsen-mono/core-utils';
import { deepMerge } from './deep-merge';

/**
 * Represents a type used to calculate the maximum depth of nested structures in TypeScript.
 *
 * The `MaxDepth` type is defined as a tuple where each subsequent index increments the depth level.
 * This type is often used for managing recursion limits when working with deeply nested types or data structures.
 *
 * The tuple starts with `never` at the 0th position, followed by numeric indices representing depth levels
 * (e.g., 0, 1, 2, 3, 4, 5, etc.) with further levels extending as needed.
 */
type MaxDepth = [never, 0, 1, 2, 3, 4, 5, ...never[]];

/**
 * Helper to escape dot characters ('.') within a string type.
 * Useful for maintaining literal dots in keys during path generation.
 *
 * @template S - The string or number to escape.
 */
type EscapeDots<S extends string | number> = S extends string
  ? S extends `${infer T}.${infer U}`
    ? `${T}\\.${EscapeDots<U>}`
    : S
  : S;

/**
 * A TypeScript type utility to recursively unescape dot characters in a string.
 *
 * The `UnescapeDots` type searches for patterns of escaped dots (represented as `\.`)
 * within a string and replaces them with unescaped dots (`.`). This process is recursively
 * applied to handle multiple instances of escaped dots in the input string until all are unescaped.
 *
 * @template S The string type on which the unescaping operation will be performed.
 *
 * @typeParam S Represents the input string that may contain escaped dots (`\.`) to be unescaped.
 *
 * @example
 * // A type that resolves escaped dots in the string `a\.b\.c` to `a.b.c`.
 * type Unescaped = UnescapeDots<"a\\.b\\.c">; // Results in "a.b.c".
 */
type UnescapeDots<S extends string> = S extends `${infer T}\\.${infer U}` ? `${T}.${UnescapeDots<U>}` : S;

/**
 * A utility type that excludes `null` and `undefined` from a given type `T`.
 *
 * The `NonNullableStructure` type ensures that the resulting type will not
 * contain nullability, making it safer for scenarios where values must be
 * non-null and non-undefined.
 *
 * @template T - The type from which `null` and `undefined` are excluded.
 */
type NonNullableStructure<T> = Exclude<T, undefined | null>;

/**
 * Represents a mapped type that removes the `readonly` modifier from all properties
 * of an object type `T`.
 *
 * @template T - The object type from which the `readonly` modifier will be removed.
 */
type KeyWithoutReadonly<T> = {
  -readonly [K in keyof T]: T[K];
};

/**
 * Represents a recursive TypeScript type that generates key paths for a given structure `T`
 * up to a specified depth `D`. This is particularly useful when working with deeply nested objects
 * or arrays, and you need the paths in string format.
 *
 * @template T - The type of the object or structure for which key paths will be generated.
 * @template D - The maximum depth of the key paths to generate. Defaults to 5.
 *
 * Key Characteristics of `KeyPathImpl`:
 * - Leverages type recursion to traverse nested structures and produce valid key paths.
 * - Supports objects, arrays, and structures that may combine these types.
 * - Avoids key paths for "atomic" objects that do not have further nested properties (e.g., strings, numbers, etc.).
 * - Provides additional logic to handle arrays with numeric indices and maps their corresponding key paths.
 *
 * - The following constraints are observed:
 *   - If `T` is atomic or non-nested, the result is `never`.
 *   - If `T` is an array, the key paths include numeric indices and paths to nested elements.
 *   - If `T` is an object, the key paths include property names and nested paths.
 *   - The traversal respects the specified maximum depth `D` to avoid excessive recursion.
 *
 * This utility type is often used in scenarios where dynamic key path definitions are required,
 * such as building query engines, validation schemas, or dynamic access to deeply nested structures.
 */
type KeyPathImpl<T, D extends number = 5> = [D] extends [never]
  ? never
  : NonNullableStructure<T> extends AtomicObject
    ? never
    : // biome-ignore lint/suspicious/noExplicitAny: any is used here to avoid type errors
      NonNullableStructure<T> extends readonly any[]
      ? number extends NonNullableStructure<T>['length']
        ? `${number}` | `${number}.${KeyPathImpl<NonNullableStructure<T>[number], MaxDepth[D]>}`
        : {
            [K in keyof NonNullableStructure<T> & string]:
              | K
              | `${K}.${KeyPathImpl<NonNullableStructure<T>[K], MaxDepth[D]>}`;
          }[keyof NonNullableStructure<T> & string]
      : NonNullableStructure<T> extends object
        ? {
            [K in keyof NonNullableStructure<T> & string]: EscapeDots<K> extends string
              ? EscapeDots<K> | `${EscapeDots<K>}.${KeyPathImpl<NonNullableStructure<T>[K], MaxDepth[D]>}`
              : never;
          }[keyof NonNullableStructure<T> & string]
        : never;

/**
 * Represents a type that computes all possible key paths (dot-separated string keys)
 * for an object, including nested properties.
 *
 * @template T - The object type for which key paths are generated.
 */
export type KeyPath<T extends object> = KeyPathImpl<T>;

/**
 * Represents the value at a specific path in an object structure, where paths are defined
 * as dot-separated strings. Supports nested properties and array elements.
 *
 * @template T - The base object type to extract the value from.
 * @template P - A string representing the path to the desired value. Path keys are separated by dots.
 *
 * The path string `P` can:
 * - Locate nested properties in `T` by using dot notation, such as "key1.key2".
 * - Traverse arrays when the structure contains array elements.
 *
 * The type resolves to:
 * - A specific value type if the path exists in the structure and is valid.
 * - `null` or `undefined` if the path leads to a nullable entity.
 * - `never` if the path is invalid for the provided structure.
 */
export type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? UnescapeDots<Key> extends keyof NonNullableStructure<T>
    ? PathValue<NonNullableStructure<NonNullableStructure<T>[UnescapeDots<Key>]>, Rest>
    : NonNullableStructure<T> extends readonly (infer U)[]
      ? PathValue<NonNullableStructure<U>, Rest>
      : never
  : UnescapeDots<P> extends keyof KeyWithoutReadonly<NonNullableStructure<T>>
    ? NonNullableStructure<T>[UnescapeDots<P>] | null | undefined
    : NonNullableStructure<T> extends readonly (infer U)[]
      ? U | null | undefined
      : never;

/**
 * A utility type for constructing and manipulating deeply nested object paths in an immutable manner.
 * PathBuilder allows chaining operations to set, merge, remove, reset, and build an object.
 *
 * @template T - The type of the object being constructed and manipulated.
 *
 * @property {function} set - Sets a value at the specified path within the object.
 * @template P - The key path within the object, extending from the KeyPath of T.
 * @param {P} path - The string representation of the path to the value being set.
 * @param {PathValue<T, P>} value - The value to set at the specified path.
 * @returns {PathBuilder<T>} A new PathBuilder instance with the updated object.
 *
 * @property {function} merge - Merges a partial value into the object at the specified path.
 * @template P - The key path within the object, extending from the KeyPath of T.
 * @param {P} path - The string representation of the path where the merge occurs.
 * @param {DeepPartial<PathValue<T, P>>} value - The partial value to merge into the object.
 * @returns {PathBuilder<T>} A new PathBuilder instance with the updated object.
 *
 * @property {function} remove - Removes a value at the specified path from the object.
 * @param {KeyPath<T> & string} path - The string representation of the path to the value being removed.
 * @returns {PathBuilder<T>} A new PathBuilder instance with the value at the specified path removed.
 *
 * @property {function} reset - Resets the builder to a new initial object.
 * @param {T} newInitial - The new initial object for the PathBuilder.
 * @returns {PathBuilder<T>} A new PathBuilder instance with the reset object.
 *
 * @property {function} snapshot - Returns the current state of the object without finalizing the build.
 * @returns {T} The current state of the object.
 *
 * @property {function} build - Finalizes the building process and returns the constructed object.
 * @returns {T} The finalized object constructed by the PathBuilder.
 */
export type PathBuilder<T extends object> = {
  set<P extends KeyPath<T> & string>(path: P, value: PathValue<T, P>): PathBuilder<T>;
  merge<P extends KeyPath<T> & string>(path: P, value: DeepPartial<PathValue<T, P>>): PathBuilder<T>;
  remove(path: KeyPath<T> & string): PathBuilder<T>;
  snapshot(): T;
  build(): T;
};

/**
 * Creates a PathBuilder object that provides methods for manipulating nested properties
 * of an initial state object by specifying paths.
 *
 * @template T - The type of the object to be manipulated by the PathBuilder.
 * @param {T} initialState - The initial state of the object to be manipulated by the `PathBuilder`.
 * @return {PathBuilder<T>} A PathBuilder object with methods to set, merge, remove,
 *                          reset, snapshot, and build the state.
 */
export function createPathBuilder<T extends object>(initialState: T): PathBuilder<T> {
  const state = structuredClone(initialState);

  const builder: PathBuilder<T> = {
    set(path, value) {
      const parts = path.split(/(?<!\\)\./).map((p) => p.replace(/\\./g, '.'));
      let current = state as Record<string, unknown>;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        const nextPart = parts[i + 1];

        if (part === undefined || nextPart === undefined) {
          continue;
        }

        if (!(part in current) || current[part] == null) {
          current[part] = !Number.isNaN(Number(nextPart)) ? [] : {};
        }

        current = current[part] as Record<string, unknown>;
      }

      const lastPart = parts[parts.length - 1];
      if (lastPart !== undefined) {
        current[lastPart] = value;
      }
      return builder;
    },

    merge(path, partialValue) {
      const parts = path.split(/(?<!\\)\./).map((p) => p.replace(/\\./g, '.'));
      let current = state as Record<string, unknown>;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (part === undefined) continue;

        if (!(part in current) || current[part] == null) {
          const nextPart = parts[i + 1];
          current[part] = !Number.isNaN(Number(nextPart)) ? [] : {};
        }
        current = current[part] as Record<string, unknown>;
      }

      const lastKey = parts[parts.length - 1];
      if (lastKey !== undefined) {
        const clonedSource = structuredClone(partialValue);

        if (isRecord(clonedSource) && !isAtomic(clonedSource)) {
          const currentTarget = current[lastKey];

          if (!isRecord(currentTarget)) {
            current[lastKey] = {};
          }

          deepMerge(current[lastKey] as Record<string, unknown>, clonedSource);
        } else {
          current[lastKey] = clonedSource;
        }
      }
      return builder;
    },

    remove(path) {
      const parts = path.split(/(?<!\\)\./).map((p) => p.replace(/\\./g, '.'));
      let current = state as Record<string, unknown>;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (part === undefined || !(part in current) || current[part] == null) return builder;
        current = current[part] as Record<string, unknown>;
      }

      const lastPart = parts[parts.length - 1];

      if (lastPart !== undefined) {
        if (Array.isArray(current)) {
          const index = Number(lastPart);
          if (!Number.isNaN(index)) {
            current.splice(index, 1);
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete current[lastPart];
        }
      }
      return builder;
    },

    snapshot() {
      return state;
    },

    build() {
      return structuredClone(state);
    },
  };

  return builder;
}
