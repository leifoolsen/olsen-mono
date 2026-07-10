/**
 * Determines whether the given value is a function.
 *
 * This type guard checks if the provided value is of type 'function',
 * ensuring that it can be safely used as a callable entity.
 *
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFunction = (value: unknown): value is (...args: unknown[]) => unknown => {
  return typeof value === 'function';
};
