const BLACKLISTED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Determines whether a given key is a valid key of a specified object type.
 *
 * @template T The object type against which the key is validated.
 * @param {PropertyKey} key The key to validate, which can be a string, number, or symbol.
 * @param {readonly (keyof T)[]} allowedKeys An array of allowed keys for the object type.
 * @returns {key is keyof T} A boolean indicating whether the key is valid
 *                           and exists within the allowed keys for the object type.
 */
export const isValidObjectKey = <T extends object>(
  key: PropertyKey,
  allowedKeys: readonly (keyof T)[],
): key is keyof T => {
  const keyStr = typeof key === 'symbol' ? key.toString() : String(key);

  if (BLACKLISTED_KEYS.has(keyStr)) {
    return false;
  }

  return (allowedKeys as readonly PropertyKey[]).includes(key);
};
