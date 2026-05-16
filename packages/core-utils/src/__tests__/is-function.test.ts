import { describe, expect, it } from 'vitest';
import { isFunction } from '../is-function';

describe('#isPlainObject', () => {
  function MyClass(
    this: {
      x: number;
      constructor: (x: number) => void;
    },
    x: number,
  ) {
    this.x = x;
  }

  function ObjectConstructor() {
    /* empty */
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  ObjectConstructor.prototype.constructor = Object;

  it('is a function', () => {
    expect(isFunction(() => true)).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    expect(isFunction(new Function('return 1'))).toBeTruthy();
  });

  it('is not a function', () => {
    // @ts-expect-error Ok for testing
    expect(isFunction(new MyClass(2))).toBeFalsy();

    expect(isFunction(1)).toBeFalsy();
  });
});
