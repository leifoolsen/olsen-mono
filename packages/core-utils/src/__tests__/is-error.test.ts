import { describe, expect, it } from 'vitest';
import { isError } from '../is-error';

describe('isError', () => {
  it('should be an instance of Error', () => {
    const err = new Error('Test error');
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expect(isError(err)).toBeTruthy();
  });

  it('should not be an instance of Error', () => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expect(isError('I Am A Teapot')).toBeFalsy();
  });
});
