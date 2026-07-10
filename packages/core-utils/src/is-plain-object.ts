import { isProxy } from './is-proxy';

/**
 * Determines whether the given value is a plain object.
 *
 * A plain object is defined as an object created using object literal syntax
 * or an object that directly inherits from `Object.prototype`. It excludes instances of classes, arrays, functions,
 * and objects with custom prototypes (e.g., `Math`, `JSON`).
 *
 * @param value - The value to be tested.
 * @returns A boolean indicating whether the value is a plain object.
 *
 * @example
 * ```typescript
 * console.log(isPlainObject({ a: 1 }));            // true
 * console.log(isPlainObject(Object.create(null))); // true
 * console.log(isPlainObject(Math));                // false
 * console.log(isPlainObject(JSON));                // false
 * console.log(isPlainObject(new Date()));          // false
 * console.log(isPlainObject([1, 2, 3]));           // false
 * console.log(isPlainObject(new Set()));           // false
 * console.log(isPlainObject(new Map()));           // false
 * ```
 */
export const isPlainObject = (value: unknown): value is Record<PropertyKey, unknown> => {
  if (value == null || typeof value !== 'object') {
    return false;
  }

  if (Object.prototype.toString.call(value) === '[object Arguments]') {
    return false;
  }

  if (isProxy(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value) as
    | (object & {
        constructor?: unknown;
      })
    | null;

  if (proto === null) {
    return true;
  }

  const ctor = Object.hasOwn(proto, 'constructor') && proto.constructor;

  const hasObjectCtor =
    typeof ctor === 'function' && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);

  if (!hasObjectCtor) {
    return false;
  }

  return (
    proto === Object.prototype || (Object.getPrototypeOf(proto) === Object.prototype && proto !== Object.prototype)
  );
};
