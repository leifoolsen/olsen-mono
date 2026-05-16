import { describe, expect, it } from 'vitest';
import { isError } from '../is-error';

describe('isError', () => {
  it('should be an instance of Error', () => {
    const err = new Error('Test error');
    expect(isError(err)).toBeTruthy();
  });

  it('should not be an instance of Error', () => {
    expect(isError('I Am A Teapot')).toBeFalsy();
  });
});
