import { describe, expect, it } from 'vitest';
import { hello } from '../';

describe('sayHello', () => {
  it('should say hello to {{dashCase name}}', () => {
    expect(hello()).toBe('Hello from {{dashCase name}}!');
  });
});
