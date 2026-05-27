# @olsen-mono/reactive-state

> Reactive state factory

A lightweight, high-performance, and TypeScript 6-native utility package for managing
and driving reactive server states.

---

## Features

- ⚡ **TypeScript 6 & Node 26 Native**: Fully optimized for strict type narrowing, modern ECMAScript standards (including native `Error.isError`), and `noUncheckedIndexedAccess`.
- 🔀 **Three Pragmatic Patterns**: Choose between object-graph fixtures (`proxyBuilder`), dot-notated string pathways (`pathBuilder`), or a batched server-state engine (`createReactiveState`).
- 🛑 **Zero Cross-Test Leakage**: Operates strictly on isolated deep clones (`structuredClone`), preventing dirty mutations from leaking across test suites or client requests.
- 📦 **Microtask Batching**: Built-in event batching ensures multiple sequential state mutations trigger only a single asynchronous update stream.

---

## Installation

```bash
npm install @olsen-mono/object-builder
```

---

## 1. Test Proxy Builder (`createProxyBuilder`)

The `proxyBuilder` utilizes JavaScript `Proxy` reflection to intercept deep mutations. It uses a recursive `DeepRequired<T>` type structure that strips away all optional modifiers (`?`) and `undefined` types during your mock phase. This completely removes optional chaining (`?.`) clutter from your test files.

If a nested node or array index does not exist in the initial partial fixture, the proxy seamlessly initializes empty objects/arrays on-the-fly.

### Usage Example

```typescript
import { createProxyBuilder } from '@olsen-mono/object-builder';

interface UserFixture {
  id: string;
  profile?: {
    name: string;
    contact?: { email: string };
  };
  coordinates: [number, number];
}

// Start with a minimal partial object
const baseUser: DeepPartial<UserFixture> = { id: '123' };
const builder = createProxyBuilder<UserFixture>(baseUser);

// Perfect IntelliSense auto-complete. Missing parent paths are auto-materialized!
builder.profile.contact.email = 'dev@olsen-mono.no';
builder.coordinates[0] = 58.46;

// Mutating native mutable types directly
builder.createdAt.setFullYear(2026);

// TypeScript 6 strictly forbids the 'delete' operator on properties that appear Required.
// To bypass this type-constraint cleanly in your tests, use Reflect:
Reflect.deleteProperty(builder.profile, 'contact');

const finalUser = builder.build(); // Deeply cloned, complete UserFixture object
```

---

## 2. Test Path Builder (`createPathBuilder`)

The `pathBuilder` is an alternative utility designed for workflows where mutation pathways arrive as dot-notated strings (e.g., handling dynamic form inputs or path-driven events). It supports full auto-complete for nested paths, strict index bounds checking for tuples, and safely escapes dot characters within property keys.

### Usage Example

```typescript
import { createPathBuilder } from '@olsen-mono/object-builder';

const builder = createPathBuilder<AppState>({});

builder
  .set('user.name', 'Alice')
  .set('coordinates.1', 8.76)
  .set('app\\.config.debug', true) // Escapes literal dots safely
  .merge('user', { name: 'Alice Olsen' }); // Native deep merge helper

const result = builder.build();
```

---

## 3. Server Reactive State (`createReactiveState`)

The `createReactiveState` function provides a highly stable, production-ready server store for applications relying on real-time HTML streaming (like htmx or Datastar SSE).

Unlike the test builders, the server state engine respects your strict data structures completely (no forced requirements). It utilizes `Reflect` proxies to retain flawless reactivity for getters (`this` contexts) and native operations on `Map`, `Set`, or `Date` collections.

### Usage Example

```typescript
import { createReactiveState } from '@olsen-mono/object-builder';

// Supports partial initialization (Alternative B) while validating against the full schema
const store = createReactiveState<UserStore>({
  user: { id: 42 },
});

// Subscribe to state shifts (e.g., streaming HTML inside a Hono SSE route)
const unsubscribe = store.subscribe(() => {
  const currentSnapshot = store.snapshot();
  console.log(`State shifted asynchronously! Current user: ${currentSnapshot.user.name}`);
});

// Mutating properties triggers an asynchronous microtask-batched event
store.state.user.name = 'Alice';
store.state.user.age = 30; // Triggers only ONE unified subscriber notification!

// Explicit String-Path Binding (Perfect for HTML Form Fields)
const nameBinding = store.bind<string>('user.name');
console.log(nameBinding.value); // "Alice"
nameBinding.onChange('Jane'); // Mutates the store safely and triggers subscribers
```

### Documentation: Object Overwrite Behavior

When tildeling a new object to a state category, the proxy adheres strictly to standard JavaScript object semantics. **It overwrites the category completely.** If you wish to preserve existing deep properties, you must spread or merge them manually.

```typescript
// Destructive Overwrite: 'profile' is completely replaced and wiped clean
store.state.user = { id: 1, name: 'Jane' };

// Safe Merging: Preserving deep structures during an object replacement
store.state.user = {
  ...store.state.user,
  name: 'Jane Updated',
  profile: { ...store.state.user.profile, avatarUrl: 'new.png' },
};
```

---

## Pattern Comparison Matrix

| Feature              | `proxyBuilder`                | `pathBuilder`                | `createReactiveState`                   |
| :------------------- | :---------------------------- | :--------------------------- | :-------------------------------------- |
| **Primary Use-Case** | Fast Test Data Fixtures       | Dynamic String Paths         | Production Server State (BFF)           |
| **Mutation Style**   | Native Property (`obj.a = v`) | String Path (`'a.b'`)        | Native Property (`obj.a = v`)           |
| **Type Integrity**   | `DeepRequired` (Lies to IDE)  | String Tokenization          | Complete `T` (Honest Types)             |
| **Missing Nodes**    | Auto-materializes structures  | Auto-materializes structures | Auto-materializes structures            |
| **Event Reactivity** | None (Silent sandbox)         | None (Silent sandbox)        | Asynchronous Batched (`queueMicrotask`) |
| **`this` / Getters** | Disabled (Cloned raw data)    | Disabled (Cloned raw data)   | Fully Enabled via `Reflect.get`         |

---

## License

MIT
