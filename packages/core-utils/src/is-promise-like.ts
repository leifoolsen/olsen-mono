/**
 * Determines whether a value is "thenable" (Promise-like).
 *
 * This follows the Promises/A+ spec by checking if the value is an object or
 * function that possesses a `.then()` method.
 *
 * @param value - The value to check.
 * @returns True if the value conforms to the PromiseLike interface, otherwise false.
 */
export const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  !!value &&
  (typeof value === 'object' || typeof value === 'function') &&
  'then' in value &&
  typeof value.then === 'function';
