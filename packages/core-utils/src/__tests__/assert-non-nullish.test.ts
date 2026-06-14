import { describe, expect, it } from 'vitest';
import { assertNonNullish } from '../assert-non-nullish';

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

describe('assertNonNullish', () => {
  it('should not throw if value is non-nullish', () => {
    expect(() => {
      assertNonNullish(false);
    }).not.toThrow();
    expect(() => {
      assertNonNullish(1);
    }).not.toThrow();
  });

  it('should not throw for falsy values like 0 and NaN', () => {
    expect(() => {
      assertNonNullish(0);
    }).not.toThrow();
    expect(() => {
      assertNonNullish(NaN);
    }).not.toThrow();
  });

  it('empty string should be non nullish', () => {
    expect(() => {
      assertNonNullish('');
    }).not.toThrow();
  });

  it('should throw default error', () => {
    expect(() => {
      assertNonNullish(null);
    }).toThrow('Value is null or undefined');
  });

  it('should throw specific Error object when passed directly', () => {
    expect(() => {
      assertNonNullish(undefined, new EvalError('BOOM'));
    }).toThrow(EvalError);
  });

  it('should throw custom Error object from factory', () => {
    expect(() => {
      assertNonNullish(undefined, () => new AuthError('Unauthorized'));
    }).toThrow(AuthError);
  });

  it('should wrap a custom string message in a standard Error object', () => {
    expect(() => {
      assertNonNullish(null, 'Custom string error');
    }).toThrow(Error);
    expect(() => {
      assertNonNullish(null, 'Custom string error');
    }).toThrow('Custom string error');
  });
});
