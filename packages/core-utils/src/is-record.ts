/**
 * Determines whether the given value is a record (an object with string keys and values of any type).
 *
 * This function checks if the provided value is of type object, not null, and not an array.
 *
 * @param {unknown} value - The value to evaluate.
 * @returns {value is Record<string, unknown>} `true` if the value is a record, otherwise `false`.
 */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
