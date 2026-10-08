import { isTemporal } from './is-temporal';

/** Tracks object pairs currently being compared, so cyclic structures terminate. */
type Seen = Map<object, Set<object>>;

type Boxed = number | string | boolean | bigint | symbol;

const DURATION_FIELDS = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
  'microseconds',
  'nanoseconds',
] as const;

const isObjectLike = (val: unknown): val is object =>
  val !== null && (typeof val === 'object' || typeof val === 'function');

const isBoxedPrimitive = (val: object): val is { valueOf(): Boxed } =>
  val instanceof Number ||
  val instanceof String ||
  val instanceof Boolean ||
  val instanceof BigInt ||
  val instanceof Symbol;

/** Objects whose state lives in internal slots that cannot be inspected; only identity can make them equal. */
const isOpaque = (val: object): boolean =>
  val instanceof WeakMap ||
  val instanceof WeakSet ||
  val instanceof Promise ||
  (typeof WeakRef !== 'undefined' && val instanceof WeakRef);

const isBinary = (val: object): val is ArrayBuffer | SharedArrayBuffer | ArrayBufferView =>
  val instanceof ArrayBuffer ||
  (typeof SharedArrayBuffer !== 'undefined' && val instanceof SharedArrayBuffer) ||
  ArrayBuffer.isView(val);

const toBytes = (val: ArrayBuffer | SharedArrayBuffer | ArrayBufferView): Uint8Array =>
  ArrayBuffer.isView(val) ? new Uint8Array(val.buffer, val.byteOffset, val.byteLength) : new Uint8Array(val);

const equalBytes = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.byteLength !== b.byteLength) return false;
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const equalTemporal = (a: object, b: object): boolean => {
  if (a instanceof Temporal.Duration) {
    const other = b as Temporal.Duration;
    return DURATION_FIELDS.every((field) => a[field] === other[field]);
  }
  // Every other Temporal type implements `equals`, which also accounts for calendar and time zone.
  return (a as { equals(other: unknown): boolean }).equals(b);
};

const equalArrays = (a: unknown[], b: unknown[], seen: Seen): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!deepEqual(a[i], b[i], seen)) return false;
  }
  return true;
};

/**
 * Primitive keys/items are looked up in O(1) via `has`. Only object keys/items, which can be
 * structurally equal without being identical, fall back to a pairwise search.
 */
const equalMaps = (a: Map<unknown, unknown>, b: Map<unknown, unknown>, seen: Seen): boolean => {
  if (a.size !== b.size) return false;
  let unmatched: [unknown, unknown][] | undefined;
  for (const [keyA, valA] of a) {
    if (!isObjectLike(keyA) || b.has(keyA)) {
      if (!b.has(keyA) || !deepEqual(valA, b.get(keyA), seen)) return false;
      continue;
    }
    unmatched ??= [...b].filter(([keyB]) => isObjectLike(keyB) && !a.has(keyB));
    const index = unmatched.findIndex(([keyB, valB]) => deepEqual(keyA, keyB, seen) && deepEqual(valA, valB, seen));
    if (index === -1) return false;
    unmatched.splice(index, 1);
  }
  return true;
};

const equalSets = (a: Set<unknown>, b: Set<unknown>, seen: Seen): boolean => {
  if (a.size !== b.size) return false;
  let unmatched: unknown[] | undefined;
  for (const itemA of a) {
    if (b.has(itemA)) continue;
    if (!isObjectLike(itemA)) return false;
    unmatched ??= [...b].filter((itemB) => isObjectLike(itemB) && !a.has(itemB));
    const index = unmatched.findIndex((itemB) => deepEqual(itemA, itemB, seen));
    if (index === -1) return false;
    unmatched.splice(index, 1);
  }
  return true;
};

const equalOwnKeys = (a: object, b: object, seen: Seen, ignore?: PropertyKey): boolean => {
  const keysA = Reflect.ownKeys(a).filter((key) => key !== ignore);
  const keysB = Reflect.ownKeys(b).filter((key) => key !== ignore);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.hasOwn(b, key) || !deepEqual(Reflect.get(a, key), Reflect.get(b, key), seen)) return false;
  }
  return true;
};

const equalObjects = (a: object, b: object, seen: Seen): boolean => {
  // Same prototype from here on, so a single `instanceof` check on `a` determines the type of both.
  if (Array.isArray(a)) return equalArrays(a, b as unknown[], seen);
  if (a instanceof Map) return equalMaps(a, b as Map<unknown, unknown>, seen);
  if (a instanceof Set) return equalSets(a, b as Set<unknown>, seen);
  // `stack` differs between otherwise identical errors; `message`, `cause`, `errors` and custom fields are own keys.
  if (Error.isError(a)) return equalOwnKeys(a, b, seen, 'stack');
  return equalOwnKeys(a, b, seen);
};

function deepEqual(a: unknown, b: unknown, seen?: Seen): boolean {
  if (Object.is(a, b)) return true;
  if (!isObjectLike(a) || !isObjectLike(b) || typeof a !== typeof b) return false;
  if (typeof a === 'function') return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  // Leaf types: compared by internal state, never recursed into.
  if (a instanceof Date) return Object.is(a.getTime(), (b as Date).getTime());
  if (a instanceof RegExp) return a.source === (b as RegExp).source && a.flags === (b as RegExp).flags;
  if (isBoxedPrimitive(a)) return Object.is(a.valueOf(), (b as typeof a).valueOf());
  if (isBinary(a)) return equalBytes(toBytes(a), toBytes(b as typeof a));
  if (isTemporal(a)) return equalTemporal(a, b);
  if (isOpaque(a)) return false;

  // Composite types: assume equality for a pair already being compared further up the stack.
  seen ??= new Map();
  let pairs = seen.get(a);
  if (pairs?.has(b)) return true;
  if (!pairs) {
    pairs = new Set();
    seen.set(a, pairs);
  }
  pairs.add(b);
  try {
    return equalObjects(a, b, seen);
  } finally {
    pairs.delete(b);
  }
}

/**
 * Compares two values to determine if they are deeply equal.
 *
 * Supported types and how they are compared:
 * - Primitives: `Object.is` semantics (`NaN` equals `NaN`, `0` does not equal `-0`).
 * - Arrays, plain objects and class instances: own (string and symbol) keys, recursively.
 * - `Map` / `Set`: size and entries, recursively, regardless of insertion order.
 * - `Date`: timestamp (two invalid dates are equal).
 * - `RegExp`: `source` and `flags`.
 * - `Error`: own keys such as `message`, `cause` and `errors`, ignoring `stack`.
 * - `ArrayBuffer`, typed arrays and `DataView`: byte contents.
 * - Boxed primitives (`new Number(1)`, …): their primitive value.
 * - Temporal objects: `equals`, or field by field for `Temporal.Duration`.
 * - `WeakMap`, `WeakSet`, `WeakRef`, `Promise` and functions: identity only, since their state cannot be inspected.
 *
 * Values with different prototypes are never equal, and cyclic references are supported.
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns A boolean indicating whether the two values are deeply equal.
 */
export const isEqual = (a: unknown, b: unknown): boolean => deepEqual(a, b);
