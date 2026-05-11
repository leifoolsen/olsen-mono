import { isPromiseLike } from '@olsen-mono/core-utils';

type Success<T> = readonly [undefined, T];
type Failure<E> = readonly [E, undefined?];

/**
 * A Tuple representing the result of an operation.
 * Inspired by Go-style error handling.
 */
type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Synchronously executes a function and captures any thrown errors.
 * It imitates the concept of the scala.util.Try monad or the Go programming language’s approach to error handling.
 *
 * @param input - A synchronous function to execute.
 * @returns A [Result] tuple containing `[undefined, data]` on success or `[error]` on failure.
 * Error first encourages error handling. Returning a tuple makes renaming
 * error and data easier, especially useful if you call it many times.
 */
export function tryCatch<T, E = Error>(input: () => T): Result<T, E>;

/**
 * Asynchronously handles a Promise or a function returning a Promise.
 * It imitates the concept of the scala.util.Try monad or the Go programming language’s approach to error handling.
 *
 * @param input A Promise or an async function.
 * @returns A [Result] tuple containing `[undefined, data]` on success or `[error]` on failure.
 * Error first encourages error handling. Returning a tuple makes renaming
 * error and data easier, especially useful if you call it many times.
 */
export function tryCatch<T, E = Error>(input: PromiseLike<T> | (() => PromiseLike<T>)): PromiseLike<Result<T, E>>;

/**
 * Wrapper to handle both synchronous and asynchronous executions without traditional try/catch blocks.
 * It imitates the concept of the scala.util.Try monad or the Go programming language’s approach to error handling.
 *
 * @param input - A Promise or a (synchronous or async) function to be evaluated.
 * @returns A [Result] tuple containing `[undefined, data]` on success or `[error]` on failure.
 * Error first encourages error handling. Returning a tuple makes renaming
 * error and data easier, especially useful if you call it many times.
 */
export function tryCatch<T, E = Error>(
  input: PromiseLike<T> | (() => T | PromiseLike<T>),
): PromiseLike<Result<T, E>> | Result<T, E> {
  if (isPromiseLike(input)) {
    return input.then(
      (data) => [undefined, data] as const,
      (err: unknown) => [err as E] as const,
    );
  }

  try {
    const result = input();

    if (isPromiseLike(result)) {
      return result.then(
        (data) => [undefined, data] as const,
        (err: unknown) => [err as E] as const,
      );
    }

    return [undefined, result] as const;
  } catch (err) {
    return [err as E] as const;
  }
}
