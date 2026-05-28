# @olsen-mono/reactive-state

> Reactive state factory

A lightweight, high-performance, and TypeScript 6-native utility package for managing
and driving reactive states.

The `createReactiveState` function is an implementation of the reactive state pattern
architected as a store for applications relying on real-time HTML streaming.

---

## Features

- ⚡ **TypeScript 6 & Node 26 Native**: Fully optimized for strict type narrowing, modern ECMAScript standards (including native `Error.isError`), and `noUncheckedIndexedAccess`.
- 📦 **Microtask Batching**: Built-in event batching ensures multiple sequential state mutations trigger only a single asynchronous update stream.

---

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

### Object Overwrite Behavior

When assignning a new object to a state category, the proxy adheres strictly to standard JavaScript
object semantics. **It overwrites the category completely.** If you wish to preserve existing deep
properties, you must spread or merge them manually.

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

## A note about dependencies

This package has "zero" dependencies. It uses functions and types from the `core-utilis` package,
but dependent functions and types are injected into this bundle.

```typescript
import { baseOptions } from '@olsen-mono/tooling/tsdown';
import { defineConfig } from 'tsdown';

export default defineConfig({
  ...baseOptions,
  deps: {
    alwaysBundle: ['@olsen-mono/core-utils'],
  },
});
```

---

## License

MIT
