import { assert, describe, it } from 'vitest';
import { isPrimitive } from '../is-primitive';

describe('isPrimitive', () => {
  it('should be a primitive scalar value', () => {
    assert.equal(isPrimitive(0), true);
    assert.equal(isPrimitive(''), true);
    assert.equal(isPrimitive('str'), true);
    assert.equal(isPrimitive(Symbol()), true);
    assert.equal(isPrimitive(true), true);
    assert.equal(isPrimitive(false), true);
    assert.equal(isPrimitive(null), true);
    assert.equal(isPrimitive(undefined), true);
  });

  it('should not be a primitive', () => {
    assert.equal(isPrimitive([]), false);
    assert.equal(isPrimitive({}), false);
    assert.equal(isPrimitive(new Object()), false);
    assert.equal(isPrimitive(new Date()), false);
    assert.equal(
      isPrimitive(() => {
        /* empty */
      }),
      false,
    );
    assert.equal(isPrimitive(new Set()), false);
    assert.equal(isPrimitive(new Map()), false);
  });
});
