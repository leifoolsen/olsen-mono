[**olsen-mono**](../README.md)

---

## Functions

### isAtomic()

> **isAtomic**(`val`): val is string \| number \| boolean \| symbol \| AtomicObject \| null \| undefined

Defined in: [core-utils/src/is-atomic.ts:27](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-atomic.ts#L27)

Determines whether the given value is considered atomic.
An atomic value is a primitive value (string, number, boolean, symbol, null, undefined)
or an object that is treated as a single, indivisible unit such as Date, Error, RegExp,
ArrayBuffer, Set, Map, WeakSet, WeakMap, or other view types of ArrayBuffer,
including Temporal objects if applicable.

#### Parameters

##### val

`unknown`

The value to check for atomicity.

#### Returns

val is string \| number \| boolean \| symbol \| AtomicObject \| null \| undefined

A boolean indicating whether the provided value is atomic.

---

### isEmpty()

> **isEmpty**(`val`): `val is Empty`

Defined in: [core-utils/src/is-empty.ts:31](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-empty.ts#L31)

Checks whether a given value is considered empty.

A value is considered empty if:

- It is `null` or `undefined`.
- It is a string or array with a length of 0.
- It is a `Map` or `Set` with a size of 0.
- It is a `WeakMap` or `WeakSet` (always considered empty).
- It is a `Date` object with an invalid time value (`NaN`).
- It is a plain object with no enumerable keys or symbols.

For objects with custom data structures (e.g., `Temporal`), additional checks may apply.

#### Parameters

##### val

`unknown`

The value to be checked.

#### Returns

`val is Empty`

`true` if the value is considered empty, otherwise `false`.

---

### isEqual()

> **isEqual**(`a`, `b`): `boolean`

Defined in: [core-utils/src/is-equal.ts:34](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-equal.ts#L34)

Compares two values to determine if they are deeply equal.

This function performs a thorough equality check that supports the following types:

- Primitives (e.g., numbers, strings, booleans)
- Arrays
- Objects
- Maps
- Sets
- Dates
- Regular Expressions

It recursively compares the structures and contents of composite data types (e.g., objects, arrays)
and ensures that specialized types like `Date` and `RegExp` are checked for equality based on their internal state.

Key Features:

- Handles `null` and `undefined` values safely.
- Compares `Map` and `Set` instances by checking their size and individual entries.
- Ensures that objects with different prototypes are considered unequal.
- Compares atomic objects, like `Date` or `RegExp`, based on their unique properties or methods (e.g., `getTime()` for `Date`).

#### Parameters

##### a

`unknown`

The first value to compare.

##### b

`unknown`

The second value to compare.

#### Returns

`boolean`

A boolean indicating whether the two values are deeply equal.

---

### isError()

> **isError**(`error`): `error is Error`

Defined in: [core-utils/src/is-error.ts:1](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-error.ts#L1)

#### Parameters

##### error

`unknown`

#### Returns

`error is Error`

---

### isFunction()

> **isFunction**(`value`): `value is (args: any[]) => unknown`

Defined in: [core-utils/src/is-function.ts:11](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-function.ts#L11)

Determines whether the given value is a function.

This type guard checks if the provided value is of type 'function',
ensuring that it can be safely used as a callable entity.

#### Parameters

##### value

`unknown`

The value to check.

#### Returns

`value is (args: any[]) => unknown`

A boolean indicating whether the value is a function.

---

### isInt()

> **isInt**(`value`): value is string \| number

Defined in: [core-utils/src/is-int.ts:12](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-int.ts#L12)

Check whether a value is an integer.
Note: Choose not to name the function isInteger, so as not to confuse the name with the built-in Number.isInteger

#### Parameters

##### value

`unknown`

the value to check

#### Returns

value is string \| number

true if value is an integer value, otherwise false

#### See

[to check if a variable is an integer in JavaScript?](https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript/14636638|How)

#### Example

```ts
isInt('23'); // -> true
isInt('A'); // -> false
```

---

### isNullOrUndefined()

> **isNullOrUndefined**(`value`): value is null \| undefined

Defined in: [core-utils/src/is-null-or-undefined.ts:7](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-null-or-undefined.ts#L7)

Determines whether a given value is either null or undefined.

#### Parameters

##### value

`unknown`

The value to be checked.

#### Returns

value is null \| undefined

True if the value is null or undefined, otherwise false.

---

### isNumeric()

> **isNumeric**(`value`): value is string \| number

Defined in: [core-utils/src/is-numeric.ts:12](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-numeric.ts#L12)

Check whether a value is a numeric

#### Parameters

##### value

`unknown`

the value to check

#### Returns

value is string \| number

true if value is a numeric, otherwise false

#### See

https://github.com/ReactiveX/rxjs/blob/master/src/internal/util

#### Example

```ts
isNumeric('1.2'); // -> true
isNumeric(3); // -> true
isNumeric('a.b'); // -> false
isNumeric(' '); // -> false
```

---

### isPlainObject()

> **isPlainObject**(`value`): `value is Record<PropertyKey, unknown>`

Defined in: [core-utils/src/is-plain-object.ts:25](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-plain-object.ts#L25)

Determines whether the given value is a plain object.

A plain object is defined as an object created using object literal syntax
or an object that directly inherits from `Object.prototype`. It excludes instances of classes, arrays, functions,
and objects with custom prototypes (e.g., `Math`, `JSON`).

#### Parameters

##### value

`unknown`

The value to be tested.

#### Returns

`value is Record<PropertyKey, unknown>`

A boolean indicating whether the value is a plain object.

#### Example

```typescript
console.log(isPlainObject({ a: 1 })); // true
console.log(isPlainObject(Object.create(null))); // true
console.log(isPlainObject(Math)); // false
console.log(isPlainObject(JSON)); // false
console.log(isPlainObject(new Date())); // false
console.log(isPlainObject([1, 2, 3])); // false
console.log(isPlainObject(new Set())); // false
console.log(isPlainObject(new Map())); // false
```

---

### isPrimitive()

> **isPrimitive**(`value`): `value is Primitive`

Defined in: [core-utils/src/is-primitive.ts:11](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-primitive.ts#L11)

Check whether a value is a primitive scalar value

#### Parameters

##### value

`unknown`

the value to check

#### Returns

`value is Primitive`

true if value is a primitive, otherwise false

#### Example

```ts
isPrimitive(1); // -> true
isPrimitive(new Date()); // -> false
```

---

### isPromiseLike()

> **isPromiseLike**(`value`): `value is PromiseLike<unknown>`

Defined in: [core-utils/src/is-promise-like.ts:10](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-promise-like.ts#L10)

Determines whether a value is "thenable" (Promise-like).

This follows the Promises/A+ spec by checking if the value is an object or
function that possesses a `.then()` method.

#### Parameters

##### value

`unknown`

The value to check.

#### Returns

`value is PromiseLike<unknown>`

True if the value conforms to the PromiseLike interface, otherwise false.

---

### isProxy()

> **isProxy**(`obj`): `obj is object & ProxyMarker`

Defined in: [core-utils/src/is-proxy.ts:15](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-proxy.ts#L15)

Checks if a given object is a proxy instance.

This utility function determines whether the provided object is a proxy by
leveraging the Node.js `util.types.isProxy` function if available, or by
checking for a custom `__isProxy` property on the object.

#### Parameters

##### obj

`unknown`

The object to check.

#### Returns

`obj is object & ProxyMarker`

`true` if the object is a proxy; otherwise, `false`.

---

### isRecord()

> **isRecord**(`value`): `value is Record<string, unknown>`

Defined in: [core-utils/src/is-record.ts:1](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-record.ts#L1)

#### Parameters

##### value

`unknown`

#### Returns

`value is Record<string, unknown>`

---

### isTemporal()

> **isTemporal**(`val`): `val is TemporalObject`

Defined in: [core-utils/src/is-temporal.ts:24](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-temporal.ts#L24)

Determines if a given value is a Temporal object.

A Temporal object is any object provided by the Temporal API, including instances of
Temporal.PlainDate, Temporal.PlainTime, Temporal.PlainDateTime, Temporal.ZonedDateTime,
Temporal.Duration, Temporal.Instant, Temporal.PlainYearMonth, or Temporal.PlainMonthDay.

The function checks for the existence of the global Temporal object and validates the type
of the value accordingly.

#### Parameters

##### val

`unknown`

The value to check.

#### Returns

`val is TemporalObject`

`true` if the value is a Temporal object; otherwise, `false`.

---

### isValidObjectKey()

> **isValidObjectKey**\<`T`\>(`key`, `allowedKeys`): `key is keyof T`

Defined in: [core-utils/src/is-valid-object-key.ts:12](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/core-utils/src/is-valid-object-key.ts#L12)

Determines whether a given key is a valid key of a specified object type.

#### Type Parameters

##### T

`T` _extends_ `object`

The object type against which the key is validated.

#### Parameters

##### key

`PropertyKey`

The key to validate, which can be a string, number, or symbol.

##### allowedKeys

readonly keyof `T`[]

An array of allowed keys for the object type.

#### Returns

`key is keyof T`

A boolean indicating whether the key is valid
and exists within the allowed keys for the object type.
