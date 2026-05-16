import { describe, expect, it } from 'vitest';
import { isRecord } from '../is-record';

describe('isRecord', () => {
  it('should be an instance a Record<string, unknown>', () => {
    const foo = { bar: 'baz' };
    expect(isRecord(foo)).toBeTruthy();
  });

  it('should NOT be an instance a Record<string, unknown>', () => {
    const foo = [1, 2, 3];
    expect(isRecord(foo)).toBeFalsy();
  });
});
