/**
 * Represents a functional pattern-matching construct that allows executing
 * specific logic based on predicates and provides a fallback mechanism.
 *
 * @template X - The input type to match against.
 * @template Y - The output type produced by the matching functions.
 *
 * @property on - Registers a condition (predicate) and the corresponding
 * function to execute if the predicate evaluates to true.
 * @param pred - A predicate function that takes an input of type X and returns
 * a boolean indicating whether the condition matches.
 * @param fn - A function that gets executed with the input of type X if the
 * predicate predicate evaluates to true. It produces an output of type Y.
 * @returns The Match instance for chaining additional conditions.
 *
 * @property otherwise - Defines a fallback function that gets executed when no
 * registered condition matches.
 * @param fn - A function that takes an input of type X and produces an output
 * of type Y.
 * @returns The output of the fallback function.
 *
 * @property toString - Prevents string conversion for Match.
 * @returns This method always throws and ensures no string representation can be generated.
 *
 * @property [Symbol.toPrimitive] - Prevents implicit coercion of Match to a primitive.
 * @param hint - A string hint for the type of primitive conversion.
 * @returns This method always throws and ensures no primitive conversion can occur.
 */
type Match<X, Y> = {
  on: (pred: (x: X) => boolean, fn: (x: X) => Y) => Match<X, Y>;
  otherwise: (fn: (x: X) => Y) => Y;
  toString: () => never;
  [Symbol.toPrimitive]: (hint: string) => never;
};

/**
 * A utility function that throws an error when .otherwise() is not called.
 */
const throwMissingOtherwise = (): never => {
  throw new Error('Match must be terminated with .otherwise()');
};

/**
 * A utility function that returns a match object with the specified value.
 */
const matched = <X, Y>(value: Y): Match<X, Y> => ({
  on: () => matched<X, Y>(value),
  otherwise: () => value,
  toString: throwMissingOtherwise,
  [Symbol.toPrimitive]: throwMissingOtherwise,
});

/**
 * A generic function that enables pattern matching for a given value.
 * This is a functional replacement for the switch statement and the if-else chain.
 *
 * @template X The type of the input value.
 * @template Y The type of the output value.
 * @param {X} x The input value to be matched against patterns.
 * @returns {Match<X, Y>} The match interface providing methods to define patterns and their corresponding handlers.
 */

/**
 * A function that creates a match object, allowing for fluent pattern matching
 * and conditional application of functions based on predicates.
 *
 * @template X - The type of the input value.
 * @template Y - The type of the output value.
 * @param {X} x - The value to perform pattern matching on.
 * @returns {Match<X, Y>} An object with methods for applying conditional logic.
 * @see {@link https://selectfrom.dev/switch-with-a-functional-and-generic-turn-547e17b0df9 | Switch with a Functional and Generic Turn}
 */
export const match = <X, Y>(x: X): Match<X, Y> => ({
  on: (pred: (x: X) => boolean, fn: (x: X) => Y) => (pred(x) ? matched<X, Y>(fn(x)) : match<X, Y>(x)),
  otherwise: (fn: (x: X) => Y) => fn(x),
  toString: throwMissingOtherwise,
  [Symbol.toPrimitive]: throwMissingOtherwise,
});
