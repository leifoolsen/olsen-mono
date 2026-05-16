/**
 * Determines whether a given value is either null or undefined.
 *
 * @param {unknown} value - The value to be checked.
 * @returns {boolean} True if the value is null or undefined, otherwise false.
 */
export const isNullOrUndefined = (value: unknown): value is null | undefined => value == null;
