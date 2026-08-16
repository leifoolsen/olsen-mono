/**
 * A TypeGuard is a type predicate function used for narrowing down the type of value.
 * It takes a value of a broader type and evaluates whether it belongs to a more specific type.
 * When used in conditional statements, the TypeScript compiler leverages this function
 * to narrow the type of the value within the scope of the condition.
 *
 * @template X - The broader type of the value being checked.
 * @template T - The narrower type the value is being checked against.
 * @param {X} x - The value to be checked for compatibility with the narrower type.
 * @returns {x is T} - Returns `true` if the value is of the narrower type, otherwise `false`.
 */
type TypeGuard<X, T extends X> = (x: X) => x is T;

/**
 * Represents a pattern matching construct for evaluating and handling conditions or patterns
 * applied on a given type.
 *
 * @template X - The input type for the matching logic.
 * @template Y - The output or result type of the matching process. Default is `unknown`.
 */
type Match<X, Y = unknown> = {
  on: <R extends Y = Y, T extends X = X>(
    pred: TypeGuard<X, T> | ((x: X) => boolean) | boolean | X,
    fn: (x: T) => R,
  ) => MatchWithResult<X, unknown extends Y ? R : Y, Y>;
  otherwise: (fn: (x: X) => Y) => Y;
};

/**
 * Represents a utility type that facilitates matching conditions on a given type `X`,
 * transforming its value based on specified handlers, and cumulatively building a result type `R`.
 *
 * @template X The input type on which conditions will be matched.
 * @template R The accumulated result type based on executed match handlers.
 * @template Y An optional type parameter representing the expected result type of the match handlers.
 */
type MatchWithResult<X, R, Y = unknown> = {
  on: <NR extends Y, NT extends X = X>(
    pred: TypeGuard<X, NT> | ((x: X) => boolean) | boolean | X,
    fn: (x: NT) => NR,
  ) => MatchWithResult<X, unknown extends Y ? R | NR : Y, Y>;
  otherwise: <NR extends Y>(fn: (x: X) => NR) => unknown extends Y ? R | NR : Y;
};

/**
 * Represents a higher-order function used for pattern matching.
 * Allows chaining through the `on` method and provides a fallback result
 * through the `otherwise` method.
 *
 * @param value - The input value to be used in the pattern matching process.
 * @typeParam X - The type representing the matched pattern.
 * @typeParam R - The type of the input value.
 * @typeParam Y - The type of the result produced after pattern matching.
 * @returns An object containing methods `on` and `otherwise` for pattern matching.
 */
const matched = <X, R, Y>(value: R): MatchWithResult<X, R, Y> => ({
  on: () => matched<X, R, Y>(value),
  otherwise: () => value as unknown as unknown extends Y ? R : Y,
});

/**
 * Represents a function to create a `Match` object for pattern matching on the given input.
 *
 * @template X - The type of the input value to be matched. Defaults to `undefined`.
 * @template Y - The type of the result produced by the match. Defaults to `unknown`.
 * @param {X} [x] - The input value to be matched. This value is optional.
 * @returns {Match<X, Y>} A `Match` object that allows for pattern matching operations using `.on()` or `.otherwise()`.
 */
export const match = <X = undefined, Y = unknown>(x?: X): Match<X, Y> => ({
  on: <R extends Y = Y, T extends X = X>(
    pred: TypeGuard<X, T> | ((x: X) => boolean) | boolean | X,
    fn: (x: T) => R,
  ): MatchWithResult<X, unknown extends Y ? R : Y, Y> => {
    const isMatched = typeof pred === 'function' ? (pred as (x: X) => boolean)(x as X) : pred === x || pred === true;

    return isMatched
      ? matched<X, unknown extends Y ? R : Y, Y>(fn(x as unknown as T) as unknown as unknown extends Y ? R : Y)
      : (match<X, Y>(x) as unknown as MatchWithResult<X, unknown extends Y ? R : Y, Y>);
  },
  otherwise: (fn: (x: X) => Y): Y => fn(x as X),
});

/**
 * Represents an asynchronous pattern matching construct, allowing the user to define
 * conditional execution paths through a sequence of predicates and associated handler functions.
 *
 * @template X - The input type on which the pattern matching operates.
 * @template Y - The return type of the matched result, defaults to `unknown`.
 */
type MatchAsync<X, Y = unknown> = {
  on: <R extends Y = Y, T extends X = X>(
    pred: TypeGuard<X, T> | ((x: X) => boolean | Promise<boolean>) | boolean | X,
    fn: (x: T) => R | Promise<R>,
  ) => MatchWithResultAsync<X, unknown extends Y ? R : Y, Y>;
  otherwise: (fn: (x: X) => Y | Promise<Y>) => Promise<Y>;
};

/**
 * Represents a structure facilitating conditional asynchronous matching of an input type `X`
 * to produce an output result type `R`. Optionally, a narrowing result type `Y` may be defined,
 * defaulting to `unknown` if unspecified.
 *
 * @template X The input type the matching operates on.
 * @template R The result type produced by the match once resolved.
 * @template Y (Optional) The narrowed output type defaulting to `unknown` if not specified.
 */
type MatchWithResultAsync<X, R, Y = unknown> = {
  on: <NR extends Y, NT extends X = X>(
    pred: TypeGuard<X, NT> | ((x: X) => boolean | Promise<boolean>) | boolean | X,
    fn: (x: NT) => NR | Promise<NR>,
  ) => MatchWithResultAsync<X, unknown extends Y ? R | NR : Y, Y>;
  otherwise: <NR extends Y>(fn: (x: X) => NR | Promise<NR>) => Promise<unknown extends Y ? R | NR : Y>;
};

/**
 * Creates an asynchronous match handler that processes a value of type `R` or a promise resolving to type `R`.
 *
 * The `matchedAsync` function returns an object implementing methods for handling conditional flows
 * in a fluent and asynchronous manner. It allows chaining of actions with `on` and `otherwise` methods,
 * enabling deferred evaluation of logic depending on the matched criteria.
 *
 * @template X The input type used for pattern matching conditions.
 * @template R The resolved type of the input value or promise.
 * @template Y The type of the value returned by the "otherwise" method in cases where no patterns match.
 * @param {R | Promise<R>} value The value to be processed, which can either be a resolved result or a promise resolving to it.
 * @returns {MatchWithResultAsync<X, R, Y>} An object containing methods `on` for conditional matching
 * and `otherwise` for default resolution.
 */
const matchedAsync = <X, R, Y>(value: R | Promise<R>): MatchWithResultAsync<X, R, Y> => ({
  on: () => matchedAsync<X, R, Y>(value),
  otherwise: async () => value as unknown as unknown extends Y ? R : Y,
});

/**
 * Provides an asynchronous matching mechanism for handling values based on specified conditions.
 * Allows chaining of match cases with predicates and corresponding handler functions,
 * and an optional fallback/default handler for unmatched cases.
 *
 * @template X Specifies the type of the input value to be matched. Defaults to `undefined`.
 * @template Y Specifies the type of the resulting value from a match. Defaults to `unknown`.
 * @param {X} [x] The input value to be evaluated against specified predicates. Omitted/optional.
 * @returns {MatchAsync<X, Y>} An object facilitating asynchronous match handling
 * and chaining through `on` and `otherwise` methods.
 */
export const matchAsync = <X = undefined, Y = unknown>(x?: X): MatchAsync<X, Y> => ({
  on: <R extends Y = Y, T extends X = X>(
    pred: TypeGuard<X, T> | ((x: X) => boolean | Promise<boolean>) | boolean | X,
    fn: (x: T) => R | Promise<R>,
  ): MatchWithResultAsync<X, unknown extends Y ? R : Y, Y> => {
    const runMatch = async () => {
      const isMatched =
        typeof pred === 'function'
          ? await (pred as (x: X) => boolean | Promise<boolean>)(x as X)
          : pred === x || pred === true;

      if (isMatched) {
        return fn(x as unknown as T);
      }
      throw new Error('Not matched');
    };

    const promise = runMatch();

    const createChain = <R>(currentPromise: Promise<R>): MatchWithResultAsync<X, R, Y> => ({
      on: <NR extends Y, NT extends X = X>(
        nextPred: TypeGuard<X, NT> | ((x: X) => boolean | Promise<boolean>) | boolean | X,
        nextFn: (value: NT) => NR | Promise<NR>,
      ): MatchWithResultAsync<X, unknown extends Y ? R | NR : Y, Y> => {
        const nextPromise = currentPromise.catch(async (err) => {
          if (err instanceof Error && err.message !== 'Not matched') throw err;

          const isMatched =
            typeof nextPred === 'function'
              ? await (nextPred as (value: X) => boolean | Promise<boolean>)(x as X)
              : nextPred === x || nextPred === true;

          if (isMatched) return await nextFn(x as unknown as NT);
          throw new Error('Not matched');
        });

        return createChain(nextPromise) as unknown as MatchWithResultAsync<X, unknown extends Y ? R | NR : Y, Y>;
      },
      otherwise: <NR extends Y>(fallbackFn: (value: X) => NR | Promise<NR>) => {
        return currentPromise.catch((err) => {
          if (err instanceof Error && err.message !== 'Not matched') throw err;
          return fallbackFn(x as X);
        }) as Promise<unknown extends Y ? R | NR : Y>;
      },
    });

    return {
      on: <NR extends Y, NT extends X = X>(
        nextPred: TypeGuard<X, NT> | ((value: X) => boolean | Promise<boolean>) | boolean | X,
        nextFn: (value: NT) => NR | Promise<NR>,
      ): MatchWithResultAsync<X, unknown extends Y ? R | NR : Y, Y> => {
        const nextPromise = promise.catch(async (err) => {
          if (err instanceof Error && err.message !== 'Not matched') throw err;

          const isMatched =
            typeof nextPred === 'function'
              ? await (nextPred as (x: X) => boolean | Promise<boolean>)(x as X)
              : nextPred === x || nextPred === true;

          if (isMatched) return await nextFn(x as unknown as NT);
          throw new Error('Not matched');
        });

        return createChain(nextPromise) as unknown as MatchWithResultAsync<X, unknown extends Y ? R | NR : Y, Y>;
      },
      otherwise: <NR extends Y>(fallbackFn: (value: X) => NR | Promise<NR>) => {
        return promise.catch((err) => {
          if (err instanceof Error && err.message !== 'Not matched') throw err;
          return fallbackFn(x as X);
        }) as Promise<unknown extends Y ? R : Y>;
      },
    };
  },
  otherwise: async (fn: (x: X) => Y | Promise<Y>): Promise<Y> => fn(x as X),
});
