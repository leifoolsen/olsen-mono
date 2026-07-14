type Match<X, Y> = {
  on: (pred: (x: X) => boolean, fn: (x: X) => Y) => Match<X, Y>;
  otherwise: (fn: (x: X) => Y) => Y;
};

const matched = <X, Y>(value: Y): Match<X, Y> => {
  return {
    on: () => matched<X, Y>(value),
    otherwise: () => value,
  };
};

export const match = <X, Y>(x: X): Match<X, Y> => ({
  on: (pred: (x: X) => boolean, fn: (x: X) => Y) => (pred(x) ? matched(fn(x)) : match(x)),
  otherwise: (fn: (x: X) => Y) => fn(x),
});
