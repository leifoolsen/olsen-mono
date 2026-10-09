import { isPromiseLike } from './is-promise-like';

type Success<T> = readonly [undefined, T];
type Failure<E> = readonly [E, undefined?];

/**
 * A Tuple representing the result of an operation.
 * Inspired by Go-style error handling.
 */
type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Synchronously executes a function and captures any thrown errors.
 * Inspired by Go-style error handling.
 *
 * @param input - A synchronous function to execute.
 * @returns A [Result] tuple containing `[undefined, data]` on success or `[error]` on failure.
 * Error first encourages error handling. Returning a tuple makes renaming
 * error and data easier, especially useful if you call it many times.
 */
export function tryCatch<T, E = Error>(input: () => T): Result<T, E> {
  try {
    const result = input();

    if (isPromiseLike(result)) {
      throw new TypeError('tryCatch received a Promise. Use tryCatchAsync for asynchronous operations.');
    }

    return [undefined, result] as const;
  } catch (err) {
    return [err as E] as const;
  }
}

/**
 * Asynchronously handles a Promise or a function returning a Promise.
 * Captures both synchronous failures within the wrapper and rejected Promises.
 *
 * @param input An async function.
 * @returns A [Result] tuple containing `[undefined, data]` on success or `[error]` on failure.
 * Error first encourages error handling. Returning a tuple makes renaming
 * error and data easier, especially useful if you call it many times.
 */
export async function tryCatchAsync<T, E = Error>(input: () => PromiseLike<T> | T): Promise<Result<T, E>> {
  try {
    const resolvedInput = input();

    if (isPromiseLike(resolvedInput)) {
      return await resolvedInput.then(
        (data) => [undefined, data] as const,
        (err: unknown) => [err as E] as const,
      );
    }

    return [undefined, resolvedInput as T] as const;
  } catch (err) {
    return [err as E] as const;
  }
}
