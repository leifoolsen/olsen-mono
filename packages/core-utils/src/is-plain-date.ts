/**
 * Determines whether the given value is an instance of `Temporal.PlainDate`.
 *
 * This type guard function checks if the provided value is not null, is of type `object`,
 * and is an instance of the `Temporal.PlainDate` class from the Temporal API.
 *
 * @param val - The value to check.
 * @returns A boolean indicating if the value is a `Temporal.PlainDate` instance.
 */
export const isPlainDate = (val: unknown): val is Temporal.PlainDate => {
  return val != null && typeof val === 'object' && val instanceof Temporal.PlainDate;
};
