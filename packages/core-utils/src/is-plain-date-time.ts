/**
 * Determines whether a value is an instance of Temporal.PlainDateTime.
 *
 * This function checks if the provided value is not null, is of type "object",
 * and is an instance of the Temporal.PlainDateTime class.
 *
 * PlainDateTime is typically used for "alarm clock time" or future recurring appointments
 * where the local time should be locked regardless of daylight saving time
 * changes (e.g. "The store always opens at 8:00 AM").
 *
 * @param {unknown} val - The value to be checked.
 * @returns {boolean} - Returns true if the value is a Temporal.PlainDateTime, otherwise false.
 */
export const isPlainDateTime = (val: unknown): val is Temporal.PlainDateTime =>
  val != null && typeof val === 'object' && val instanceof Temporal.PlainDateTime;
