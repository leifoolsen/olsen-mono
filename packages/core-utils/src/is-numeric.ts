/**
 * Check whether a value is a numeric
 * @param value the value to check
 * @return {boolean} true if value is a numeric, otherwise false
 * @see https://github.com/ReactiveX/rxjs/blob/master/src/internal/util
 * @example
 * isNumeric('1.2'); // -> true
 * isNumeric(3); // -> true
 * isNumeric('a.b'); // -> false
 * isNumeric(' '); // -> false
 */
export const isNumeric = (value: unknown): value is number | string => {
  if (typeof value === 'bigint') {
    return true;
  }

  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }

  return typeof value === 'string' && value.trim() === '' ? false : Number.isFinite(Number(value));
};
