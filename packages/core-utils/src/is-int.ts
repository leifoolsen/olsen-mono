/**
 * Check whether a value is an integer.
 * Note: Choose not to name the function isInteger, so as not to confuse the name with the built-in Number.isInteger
 *
 * @param value the value to check
 * @return {boolean} true if value is an integer value, otherwise false
 * @see {@link https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript/14636638|How to check if a variable is an integer in JavaScript?}
 * @example
 * isInt('23'); // -> true
 * isInt('A'); // -> false
 */
export const isInt = (value: unknown): value is number | string => {
  if (typeof value === 'bigint') {
    return true;
  }

  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  const num = Number(value);

  return Number.isInteger(num);
};
