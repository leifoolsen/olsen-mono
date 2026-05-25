/**
 * A union type representing various Temporal objects.
 *
 * TemporalObject can be one of the following:
 * - Temporal.PlainDate: Represents a calendar date without a time component.
 * - Temporal.PlainTime: Represents a time of day without a date component.
 * - Temporal.PlainDateTime: Represents a calendar date and time of day without a timezone.
 * - Temporal.ZonedDateTime: Represents a calendar date and time of day with a timezone.
 * - Temporal.Duration: Represents a span of time measured in various units.
 * - Temporal.Instant: Represents a fixed instant in time, independent of calendar or time zone.
 * - Temporal.PlainYearMonth: Represents a specific year and month without a day or time component.
 * - Temporal.PlainMonthDay: Represents a specific month and day without a year or time component.
 */
export type TemporalObject =
  | Temporal.PlainDate
  | Temporal.PlainTime
  | Temporal.PlainDateTime
  | Temporal.ZonedDateTime
  | Temporal.Duration
  | Temporal.Instant
  | Temporal.PlainYearMonth
  | Temporal.PlainMonthDay;

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
