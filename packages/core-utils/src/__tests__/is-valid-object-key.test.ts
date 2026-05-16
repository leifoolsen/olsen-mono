import { describe, expect, it } from 'vitest';
import { isValidObjectKey } from '../is-valid-object-key';

describe('isValidObjectKey', () => {
  type Obj = {
    foo: string;
    bar?: string;
    fn: () => string;
    sym: symbol;
  };

  const allowedKeys: readonly (keyof Obj)[] = ['foo', 'bar'] as const;

  const obj: Obj = {
    foo: 'foo',
    fn: () => 'Hello X',
    sym: Symbol('symbol'),
  };

  it('should return true for valid key', () => {
    expect(isValidObjectKey('foo', allowedKeys)).toBeTruthy();
    expect(isValidObjectKey('bar', allowedKeys)).toBeTruthy();
  });

  it('should return false for keys not in allowed list', () => {
    expect(isValidObjectKey('baz', allowedKeys)).toBeFalsy();
    expect(isValidObjectKey('fn', allowedKeys)).toBeFalsy();
    expect(isValidObjectKey('sym', allowedKeys)).toBeFalsy();
  });

  it('should set a value by key', () => {
    let isSafe = false;
    const key = 'bar';
    if (isValidObjectKey<Obj>(key, allowedKeys)) {
      obj[key] = 'bar';
      isSafe = true;
    }
    expect(isSafe).toBeTruthy();
  });

  it('should NOT set value if key is not allowed', () => {
    let isSafe = false;
    const key = 'baz';
    if (isValidObjectKey<Obj>(key, allowedKeys)) {
      // @ts-expect-error - testing invalid key
      obj[key] = 'baz';
      isSafe = true;
    }
    expect(isSafe).toBeFalsy();
  });

  it('should return false for BLACKLISTED_KEYS even if they are somehow passed in', () => {
    const maliciousKeys = ['__proto__', 'constructor', 'prototype'];

    maliciousKeys.forEach((badKey) => {
      expect(isValidObjectKey(badKey, allowedKeys)).toBeFalsy();
    });
  });

  it('should be resilient if a malicious key is added to the allowed list', () => {
    const compromisedList = [...allowedKeys, '__proto__'];
    expect(isValidObjectKey('__proto__', compromisedList)).toBeFalsy();
  });
});
