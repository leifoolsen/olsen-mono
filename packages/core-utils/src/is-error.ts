/**
 * Determines whether the given value is an instance of the `Error` class.
 *
 * @param {unknown} error - The value to be checked.
 * @returns {boolean} True if the value is an instance of `Error`, otherwise false.
 */
export const isError = (error: unknown): error is Error => error instanceof Error;
