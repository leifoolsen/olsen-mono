type Primitive = string | number | bigint | boolean | symbol | null | undefined;

/**
 * Check whether a value is a primitive scalar value
 * @param value the value to check
 * @return {boolean} true if value is a primitive, otherwise false
 * @example
 * isPrimitive(1); // -> true
 * isPrimitive(new Date()); // -> false
 */
export const isPrimitive = (value: unknown): value is Primitive =>
  value == null ||
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'bigint' ||
  typeof value === 'boolean' ||
  typeof value === 'symbol';
