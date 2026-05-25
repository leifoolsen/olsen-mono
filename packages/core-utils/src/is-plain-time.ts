/**
 * Checks if the provided value is an instance of `Temporal.PlainTime`.
 *
 * This function performs a runtime check to determine if the given value
 * is a non-null object and an instance of the `Temporal.PlainTime` class.
 *
 * @param {unknown} val - The value to test for being a `Temporal.PlainTime` instance.
 * @returns {val is Temporal.PlainTime} `true` if the value is an instance of `Temporal.PlainTime`; otherwise, `false`.
 */
export const isPlainTime = (val: unknown): val is Temporal.PlainTime =>
  val != null && typeof val === 'object' && val instanceof Temporal.PlainTime;
