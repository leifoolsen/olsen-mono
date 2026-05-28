# @olsen-mono/object-builder

A lightweight, high-performance, and TypeScript 6-native utility package for creating
type-safe deep object mutations and test fixtures. It provides two distinct strategies
to build, alter, and prepare deeply nested state structures.

This package is architected specifically to act as a **Sandbox/Builder**
layer in modern architectures before data is validated (e.g., via Zod) and pushed
into a **Reactive State** store.

## Features

- ⚡ **TypeScript 6 & Node 26 Native**: Built from the ground up to support strict type narrowing, `noUncheckedIndexedAccess`, and `PropertyKey` dynamic resolutions.
- 🎯 **Zero-Stye IntelliSense**: No more endless optional chaining (`?.`) or defensive `if`-guards in your test setups.
- 🔀 **Two Patterns**: Choose between flat string-path mutations (`pathBuilder`) or natural object-graph traversals (`proxyBuilder`).
- 🛑 **Zero Cross-Test Leakage**: Operates strictly on isolated deep clones (`structuredClone`), preventing dirty mutations from leaking across test suites or client requests.

---

## 1. Proxy Builder (`createProxyBuilder`)

The `proxyBuilder` utilizes JavaScript `Proxy` reflection to intercept deep mutations.
It uses a recursive `DeepRequired<T>` type structure that removes all optional
modifiers (`?`) and `undefined` types during the mutation phase.

If a nested node (or array index) does not exist in the initial object, the proxy
seamlessly initializes empty objects/arrays on-the-fly.

### Usage Example

```typescript
import type { DeepPartial } from '@olsen-mono/core-utils';
import { createProxyBuilder } from '@olsen-mono/object-builder';

type UserFixture = {
  id: string;
  profile?: {
    name: string;
    contact?: {
      email: string;
    };
  };
  coordinates: [number, number];
  tags: string[];
};

const baseUser: DeepPartial<UserFixture> = { id: '123' };

const builder = createProxyBuilder<UserFixture>(baseUser);

// IDE auto-complete! No 'if' checks or optional chaining needed
builder.profile.contact.email = 'dev@olsen-mono.no';
builder.coordinates[0] = 58.46; // Strict index validation
builder.tags.push('typescript-6');

const finalUser = builder.build();
// finalUser is now a deeply cloned, structurally complete UserFixture object
```

### Mutating Native Types & Strict Deletions

The builder natively supports mutable built-in JavaScript objects like `Set`, `Map`,
and `Date`, and honors TypeScript 6's strict `delete` constraints.

```typescript
// Mutating Date objects directly
builder.createdAt.setFullYear(2026);

// TypeScript 6 strictly forbids the 'delete' operator on properties that appear Required.
// To bypass this type-constraint safely without ugly type-casting, use Reflect:
Reflect.deleteProperty(builder.profile, 'contact');
```

---

## 2. Path Builder (`createPathBuilder`)

The `pathBuilder` is an alternative utility designed for workflows where data pathways
a rrive as dot-notated strings (e.g., handling dynamic form payloads or specific multi-step
state procedures).

It features type-safe deep key path matching, full auto-complete for nested pathways,
and support for escaped dot characters within object property names.

### Usage Example

```typescript
import { createPathBuilder } from '@olsen-mono/object-builder';

type AppState = {
  user: { name: string };
  'app.config': { debug: boolean }; // Escaped dot support
  coordinates: [number, number];
};

const builder = createPathBuilder<AppState>({});

builder
  .set('user.name', 'Alice')
  .set('coordinates.1', 8.76)
  .set('app\\.config.debug', true) // Escapes literal dots safely
  .merge('user', { name: 'Alice Olsen' }); // Deep merge utility

const result = builder.build();
```

---

## Comparison Matrix

| Capability                     | `proxyBuilder`                            | `pathBuilder`                          |
| :----------------------------- | :---------------------------------------- | :------------------------------------- |
| **Mutation Style**             | Native JS Property Access (`obj.a.b = v`) | Dot-notated String Paths (`'a.b'`)     |
| **Missing Node Handling**      | Auto-creates `{\}` or `[]` dynamically    | Auto-creates `{\}` or `[]` dynamically |
| **IntelliSense Auto-complete** | Complete Object Graph Navigation          | Flattened String Key Combinations      |
| **Tuples & Fixed Arrays**      | Enforces strict index length bounds       | Enforces strict index length bounds    |
| **Best Used For**              | Clean Test Fixtures & Mock Data setups    | Dynamic form inputs / Path-driven APIs |

---

## Architecture Context

This library is engineered to represent the ideal **Builder Step** in a unidirectional
data architecture:

---

## License

MIT
