/**
 * Asserts that the provided value is neither `null` nor `undefined`.
 * If the value is `null` or `undefined`, an error is thrown.
 *
 * @param value - The value to be checked for non-nullish status.
 * @param error - The error to throw if the value is `null` or `undefined`. This can be an instance of `Error`, a
 *   factory function that produces an `Error`, or an error message string.
 * @throws {E | Error} If the value is `null` or `undefined`.
 * @asserts value is NonNullable<T>
 */
export function assertNonNullish<T, E extends Error = Error>(
  value: T,
  error: E | (() => E) | string = 'Value is null or undefined',
): asserts value is NonNullable<T> {
  if (value == null) {
    if (typeof error === 'function') {
      throw error();
    }
    throw typeof error === 'string' ? new Error(error) : error;
  }
}
