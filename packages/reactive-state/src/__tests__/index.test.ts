import { describe, expect, it } from 'vitest';
import { hello } from '../';

describe('isError', () => {
  it('should say hello to reactive-state', () => {
    expect(hello()).toBe('Hello from reactive-state!');
  });
});
