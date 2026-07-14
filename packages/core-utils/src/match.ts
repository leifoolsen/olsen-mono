/**
 * Represents a utility type for pattern matching functionality.
 *
 * @template X The type of the input value to be matched.
 * @template Y The type of the result of the matching operation.
 */
type Match<X, Y> = {
  on: (pred: (x: X) => boolean, fn: (x: X) => Y) => Match<X, Y>;
  otherwise: (fn: (x: X) => Y) => Y;
};

/**
 * A utility function that returns a match object with the specified value.
 */
const matched = <X, Y>(value: Y): Match<X, Y> => ({
  on: () => matched<X, Y>(value),
  otherwise: () => value,
});

/**
 * A generic function that enables pattern matching for a given value.
 * This is a functional replacement for the switch statement and the if-else chain.
 *
 * @template X The type of the input value.
 * @template Y The type of the output value.
 * @param {X} x The input value to be matched against patterns.
 * @returns {Match<X, Y>} The match interface providing methods to define patterns and their corresponding handlers.
 * @see {@link https://selectfrom.dev/switch-with-a-functional-and-generic-turn-547e17b0df9 | Switch with a functional and generic turn}
 */
export const match = <X, Y>(x: X): Match<X, Y> => ({
  on: (pred: (x: X) => boolean, fn: (x: X) => Y) => (pred(x) ? matched<X, Y>(fn(x)) : match<X, Y>(x)),
  otherwise: (fn: (x: X) => Y) => fn(x),
});
