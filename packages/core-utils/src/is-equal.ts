import { isAtomic } from './is-atomic';

const hasToString = (obj: unknown): obj is { toString(): string } =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  obj != null && typeof (obj as any).toString === 'function';

// const hasValueOf = (obj: unknown): obj is { valueOf(): unknown } => obj != null && typeof (obj as any).valueOf === 'function';

/**
 * Compares two values to determine if they are deeply equal.
 *
 * This function performs a thorough equality check that supports the following types:
 * - Primitives (e.g., numbers, strings, booleans)
 * - Arrays
 * - Objects
 * - Maps
 * - Sets
 * - Dates
 * - Regular Expressions
 *
 * It recursively compares the structures and contents of composite data types (e.g., objects, arrays)
 * and ensures that specialized types like `Date` and `RegExp` are checked for equality based on their internal state.
 *
 * Key Features:
 * - Handles `null` and `undefined` values safely.
 * - Compares `Map` and `Set` instances by checking their size and individual entries.
 * - Ensures that objects with different prototypes are considered unequal.
 * - Compares atomic objects, like `Date` or `RegExp`, based on their unique properties or methods (e.g., `getTime()` for `Date`).
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns A boolean indicating whether the two values are deeply equal.
 */
export const isEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) {
    return true;
  }

  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [keyA, valA] of a) {
      let foundMatch = false;
      for (const [keyB, valB] of b) {
        if (isEqual(keyA, keyB) && isEqual(valA, valB)) {
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) return false;
    }
    return true;
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const itemA of a) {
      let foundMatch = false;
      for (const itemB of b) {
        if (isEqual(itemA, itemB)) {
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) return false;
    }
    return true;
  }

  const aAtomic = isAtomic(a);
  const bAtomic = isAtomic(b);

  if (aAtomic || bAtomic) {
    if (aAtomic !== bAtomic) return false;

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    if (a instanceof RegExp && b instanceof RegExp) {
      return a.toString() === b.toString();
    }

    if (hasToString(a) && hasToString(b)) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return a.toString() === b.toString();
    }

    return false;
  }

  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return false;
  }

  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access
    if (!Reflect.has(b, key) || !isEqual((a as any)[key], (b as any)[key])) {
      return false;
    }
  }

  return true;
};
