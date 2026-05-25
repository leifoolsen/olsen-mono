import { isAtomic, type AtomicObject } from '@olsen-mono/core-utils';

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
 * A utility type that recursively makes all properties of a given type `T` optional.
 * This type is particularly useful when working with deeply nested objects where
 * partial updates or optional properties are required.
 *
 * If `T` matches:
 * - `AtomicType` (e.g., string, number, boolean, etc.), it returns `T` as-is.
 * - `Map<K, V>`, it recursively applies `DeepPartial` to the values `V` while preserving the map structure.
 * - `Set<U>`, it recursively applies `DeepPartial` to the set values `U`.
 * - Arrays of type `U[]`, it recursively applies `DeepPartial` to the array elements.
 * - Objects (`T extends object`), it makes each property of the object optional and applies `DeepPartial` recursively.
 *
 * For other types, it returns `T` unchanged.
 *
 * @template T - The type to be processed for deep partial transformation.
 */
export type DeepPartial<T> = T extends AtomicObject
  ? T
  : T extends Map<infer K, infer V>
    ? Map<K, DeepPartial<V>>
    : T extends Set<infer U>
      ? Set<DeepPartial<U>>
      : T extends (infer U)[]
        ? DeepPartial<U>[]
        : T extends object
          ? { [K in keyof T]?: DeepPartial<T[K]> }
          : T;

/**
 * Represents a type that generates a string-based path for accessing properties of a given structure.
 *
 * @template K The key type, which can be a string or number, representing the root key of the path.
 * @template V The value type associated with the key `K`, which determines the structure of the path.
 *
 * PathImpl constructs different string path patterns based on the structure of `V`:
 * - If `V` is an atomic type, a string path is returned with escaped dots in key `K`.
 * - If `V` is an array, the path includes indices and further nested paths for the array elements.
 * - If `V` is an object, the path includes nested keys and further resolution of sub-paths.
 * - Otherwise, `V` defaults to the path of the key `K` with escaped dots.
 */
type PathImpl<K extends string | number, V> = V extends AtomicObject
  ? `${EscapeDots<K>}`
  : V extends readonly (infer U)[]
    ? `${EscapeDots<K>}` | `${EscapeDots<K>}.${number}` | `${EscapeDots<K>}.${number}.${KeyPath<U>}`
    : V extends object
      ? `${EscapeDots<K>}` | `${EscapeDots<K>}.${KeyPath<V>}`
      : `${EscapeDots<K>}`;

/**
 * Represents the type for a key path that can be used to index into
 * nested structures. This type is recursively evaluated based on the
 * given generic parameter `T`, forming path structures for traversing
 * arrays or objects.
 *
 * For array types, it determines whether the array has a fixed or dynamic
 * length, generating appropriate path structures for numbered or indexed access.
 *
 * For object types, it recursively constructs path structures for each key,
 * enabling navigation through the object's hierarchy.
 *
 * @template T - The type of the structure to generate key paths for.
 */
type KeyPath<T> = T extends readonly (infer V)[]
  ? number extends T['length']
    ? PathImpl<number, V>
    : { [K in keyof T & string]: PathImpl<K, T[K]> }[keyof T & string]
  : { [K in keyof T & string]: PathImpl<K, T[K]> }[keyof T & string];

type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? UnescapeDots<Key> extends keyof T
    ? PathValue<Exclude<T[UnescapeDots<Key>], undefined | null>, Rest>
    : T extends readonly (infer U)[]
      ? PathValue<U, Rest>
      : never
  : UnescapeDots<P> extends keyof T
    ? T[UnescapeDots<P>]
    : T extends readonly (infer U)[]
      ? U
      : never;

export type PathBuilder<T extends object> = {
  set<P extends KeyPath<T> & string>(path: P, value: PathValue<T, P>): PathBuilder<T>;
  merge<P extends KeyPath<T> & string>(path: P, value: DeepPartial<PathValue<T, P>>): PathBuilder<T>;
  remove(path: KeyPath<T> & string): PathBuilder<T>;
  reset(newInitial: T): PathBuilder<T>;
  peek(): T;
  build(): T;
};

function isObject(item: unknown): item is Record<PropertyKey, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];

    if (isObject(sourceValue) && !isAtomic(sourceValue)) {
      const targetValue = target[key];

      if (!isObject(targetValue)) {
        target[key] = {};
      }

      deepMerge(target[key] as Record<string, unknown>, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }
}

export function createPathBuilder<T extends object>(initialState: T): PathBuilder<T> {
  let state = structuredClone(initialState);

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
          current[part] = !isNaN(Number(nextPart)) ? [] : {};
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
          current[part] = !isNaN(Number(nextPart)) ? [] : {};
        }
        current = current[part] as Record<string, unknown>;
      }

      const lastKey = parts[parts.length - 1];
      if (lastKey !== undefined) {
        const clonedSource = structuredClone(partialValue);

        if (isObject(clonedSource) && !isAtomic(clonedSource)) {
          const currentTarget = current[lastKey];

          if (!isObject(currentTarget)) {
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
          if (!isNaN(index)) {
            current.splice(index, 1);
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete current[lastPart];
        }
      }
      return builder;
    },

    reset(newInitial: T) {
      state = structuredClone(newInitial);
      return builder;
    },

    peek() {
      return state;
    },

    build() {
      return structuredClone(state);
    },
  };

  return builder;
}
