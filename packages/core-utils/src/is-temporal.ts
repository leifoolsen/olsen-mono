import type { TemporalObject } from './types.ts';

/**
 * Determines if a given value is a Temporal object.
 *
 * A Temporal object is any object provided by the Temporal API, including instances of
 * Temporal.PlainDate, Temporal.PlainTime, Temporal.PlainDateTime, Temporal.ZonedDateTime,
 * Temporal.Duration, Temporal.Instant, Temporal.PlainYearMonth, or Temporal.PlainMonthDay.
 *
 * The function checks for the existence of the global Temporal object and validates the type
 * of the value accordingly.
 *
 * @param {unknown} val - The value to check.
 * @returns {val is TemporalObject} `true` if the value is a Temporal object; otherwise, `false`.
 */
export const isTemporal = (val: unknown): val is TemporalObject => {
  if (val == null || typeof val !== 'object') {
    return false;
  }

  return (
    val instanceof Temporal.PlainDate ||
    val instanceof Temporal.PlainTime ||
    val instanceof Temporal.PlainDateTime ||
    val instanceof Temporal.ZonedDateTime ||
    val instanceof Temporal.Duration ||
    val instanceof Temporal.Instant ||
    val instanceof Temporal.PlainYearMonth ||
    val instanceof Temporal.PlainMonthDay
  );
};
