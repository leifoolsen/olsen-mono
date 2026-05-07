type Empty = '' | [] | null | undefined | Record<string, never>;

/**
 * Check whether a given value is empty
 * Definition of empty:
 * @param val - The value to check
 * @return `true` when value is empty, otherwise `false`
 */
export const isEmpty = (val: unknown): val is Empty => {
  if (val == null) {
    return true;
  }

  if (typeof val === 'string' || Array.isArray(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (val instanceof Date) {
    return Number.isNaN(val.getTime());
  }

  if (typeof val === 'object') {
    return Object.keys(val).length === 0;
  }

  return false;
};
