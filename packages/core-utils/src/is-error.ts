/**
 * Determines whether the given value is an instance of the `Error` class.
 *
 * @deprecated Use the built-in standard method `Error.isError()` instead.
 * This wrapper will be removed in a future update.
 *
 * @param {unknown} error - The value to be checked.
 * @returns {boolean} True if the value is an instance of `Error`, otherwise false.
 * @see {@link Error.isError}
 */
export const isError = (error: unknown): error is Error => error instanceof Error;
