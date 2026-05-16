import { describe, expect, it } from 'vitest';
import { isPlainObject } from '../is-plain-object';

describe('#isPlainObject', () => {
  function MyClass(
    this: {
      x: number;
      constructor: (x: number) => void;
    },
    x: number,
  ) {
    this.x = x;
  }

  function ObjectConstructor() {
    /* empty */
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  ObjectConstructor.prototype.constructor = Object;

  it('is a plain object', () => {
    expect(isPlainObject({})).toBeTruthy();
    expect(isPlainObject({ foo: true })).toBeTruthy();
    expect(isPlainObject({ constructor: MyClass })).toBeTruthy();
    expect(isPlainObject({ valueOf: 0 })).toBeTruthy();
    expect(isPlainObject(Object.create(null))).toBeTruthy();
    expect(isPlainObject(new Object())).toBe(true);
    expect(isPlainObject(JSON)).toBeTruthy();
    expect(isPlainObject(Math)).toBeTruthy();

    // @ts-expect-error Ok for testing
    expect(isPlainObject(new ObjectConstructor())).toBeTruthy();
  });

  it('is not a plain object', () => {
    expect(isPlainObject(['foo', 'bar'])).toBeFalsy();

    // @ts-expect-error Ok for testing
    expect(isPlainObject(new MyClass(1))).toBeFalsy();
    expect(isPlainObject(Error)).toBeFalsy();
    expect(
      isPlainObject(() => {
        /* empty */
      }),
    ).toBeFalsy();

    expect(isPlainObject(/./)).toBeFalsy();
    expect(isPlainObject(null)).toBeFalsy();
    expect(isPlainObject(undefined)).toBeFalsy();
    expect(isPlainObject(NaN)).toBeFalsy();
    expect(isPlainObject('')).toBeFalsy();
    expect(isPlainObject(0)).toBeFalsy();
    expect(isPlainObject(false)).toBeFalsy();

    (function x() {
      expect(isPlainObject(arguments)).toBeFalsy(); // eslint-disable-line prefer-rest-params
    })();

    // @ts-expect-error Ok for testing
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const foo = new MyClass(2);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    foo.constructor = Object;
    expect(isPlainObject(foo)).toBeFalsy();

    expect(isPlainObject(new Map())).toBeFalsy();
    expect(isPlainObject(new Set())).toBeFalsy();
    expect(isPlainObject(new Date())).toBeFalsy();
    expect(isPlainObject([1, 2, 3])).toBeFalsy();
    expect(isPlainObject(new Set())).toBeFalsy();
    expect(isPlainObject(new Map())).toBeFalsy();
    expect(isPlainObject(new WeakMap())).toBeFalsy();
    expect(isPlainObject(new WeakSet())).toBeFalsy();
    expect(isPlainObject(new ArrayBuffer(1))).toBeFalsy();
    expect(isPlainObject(new Int8Array(1))).toBeFalsy();
    expect(isPlainObject(new Uint8Array(1))).toBeFalsy();
    expect(isPlainObject(new Uint8ClampedArray(1))).toBeFalsy();
    expect(isPlainObject(new Float32Array(1))).toBeFalsy();
    expect(isPlainObject(new Float64Array(1))).toBeFalsy();
    expect(isPlainObject(new BigInt64Array(1))).toBeFalsy();
    expect(isPlainObject(new BigUint64Array(1))).toBeFalsy();
    expect(isPlainObject(new DataView(new ArrayBuffer(1)))).toBeFalsy();
    expect(
      isPlainObject(
        new Promise(() => {
          /* empty */
        }),
      ),
    ).toBeFalsy();

    expect(isPlainObject(new Proxy({}, {}))).toBeFalsy();
    expect(isPlainObject(new WeakRef(new Date()))).toBeFalsy();
    expect(
      isPlainObject(
        new FinalizationRegistry(() => {
          /* empty */
        }),
      ),
    ).toBeFalsy();

    expect(isPlainObject(Symbol('foo'))).toBeFalsy();
    expect(isPlainObject('foo' satisfies string)).toBeFalsy();
    expect(isPlainObject(1 satisfies number)).toBeFalsy();
    expect(isPlainObject(true satisfies boolean)).toBeFalsy();
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    expect(isPlainObject(new Function('return 1'))).toBeFalsy();
    expect(isPlainObject(new RegExp('foo'))).toBeFalsy();
    expect(isPlainObject(new Error('foo'))).toBeFalsy();
    expect(isPlainObject(new Array(1))).toBeFalsy();
    expect(isPlainObject(new Set([1, 2, 3]))).toBeFalsy();
    expect(isPlainObject(new Map([['a', 1]]))).toBeFalsy();
    expect(isPlainObject(new Intl.DateTimeFormat('en-US'))).toBeFalsy();
    expect(isPlainObject(new Intl.NumberFormat('en-US'))).toBeFalsy();
    expect(isPlainObject(new Intl.Collator('en-US'))).toBeFalsy();
    expect(isPlainObject(new Intl.ListFormat('en-US'))).toBeFalsy();
    expect(isPlainObject(new Intl.RelativeTimeFormat('en-US'))).toBeFalsy();
    expect(isPlainObject(new Intl.PluralRules('en-US'))).toBeFalsy();
    expect(isPlainObject(new Intl.DisplayNames('en-US', { type: 'language' }))).toBeFalsy();
    expect(isPlainObject(new Intl.DisplayNames('en-US', { type: 'region' }))).toBeFalsy();
    expect(isPlainObject(new Intl.DisplayNames('en-US', { type: 'script' }))).toBeFalsy();
    expect(isPlainObject(new Intl.DisplayNames('en-US', { type: 'currency' }))).toBeFalsy();
  });
});
