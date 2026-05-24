import { describe, expect, it } from 'vitest';
import { hello } from '../';

describe('isError', () => {
  it('should say hello to {{dashCase name}}', () => {
    expect(hello()).toBe('Hello from {{dashCase name}}!');
  });
});
