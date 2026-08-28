import { assert, describe, it } from 'vitest';
import { hasOwn } from '../has-own';

describe('hasOwn', () => {
  const anObject = {
    foo: 'bar',
  };

  it('should have property', () => {
    assert.equal(hasOwn(anObject, 'foo'), true);
  });

  it('should not be a primitive', () => {
    assert.equal(hasOwn(anObject, 'bar'), false);
  });
});
