/**
 * The hasOwn type guard checks whether an object has a given property key.
 * @param obj - The object to check
 * @param key - The property key
 */
export function hasOwn<T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown> {
  return Object.hasOwn(obj, key);
}
