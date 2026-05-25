/**
 * Determines if the given value is an instance of Temporal.ZonedDateTime.
 *
 * This type guard checks if the provided value is a non-null object
 * and an instance of Temporal.ZonedDateTime. It helps ensure type safety
 * when working with potentially untyped or unknown values that need to
 * be verified as Temporal.ZonedDateTime objects.
 *
 * ZonedDateTime is what you use for actual, real-time events
 * (e.g. "The train is leaving right now"), and it takes into account whether
 * it is daylight saving time or winter time in the given zone during formatting.
 *
 * @param {unknown} val - The value to be checked.
 * @returns {val is Temporal.ZonedDateTime} True if the value is a Temporal.ZonedDateTime
 * instance; otherwise, false.
 */
export const isZonedDateTime = (val: unknown): val is Temporal.ZonedDateTime =>
  val != null && typeof val === 'object' && val instanceof Temporal.ZonedDateTime;
