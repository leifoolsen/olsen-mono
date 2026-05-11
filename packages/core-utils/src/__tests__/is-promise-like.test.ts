import { describe, expect, it } from 'vitest';
import { isPromiseLike } from '../is-promise-like';

describe('isPromiselike', () => {
  it('should be thenable', () => {
    const realPromise = new Promise((resolve) => {
      resolve(42); // Fulfills the promise
    });
    expect(isPromiseLike(realPromise)).toBeTruthy();
  });

  it('should not be thenable', () => {
    const notAPromise: unknown = 'string';
    expect(isPromiseLike(notAPromise)).toBeFalsy();
  });
});
