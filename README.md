# Olsen-Mono

A modern, high-performance monorepo architecture built with **TypeScript 6**, **tsdown**,
**pnpm workspaces**, **Turborepo** and **Vite**, optimized for **Node.js 26**.

## 🏗 Architecture & Workspace Structure

The project uses a hybrid-minimalist setup. Shared configuration logic lives in a dedicated
internal tooling package, keeping individual workspace definitions "anemic" and maintainable.

```text
olsen-mono/
├── apps/
│   └── hono-htmx/          # Hono + HTMX web application (Vite-powered SSR)
├── packages/
│   ├── core-utils/          # Shared utility functions
│   ├── css-foundation/      # Modern css reset and type setting utilizing the W3C Design Tokens Standard via Open Props
│   ├── css-to-dts/          # CLI tool tailored for `pnpm` monorepos to automatically generate TypeScript definitions (`*.css.d.ts`) from CSS files
│   ├── object-builder/      # Typesafe builder pattern for object literals
│   ├── reactive-state/      # Reactive state factory
│   ├── tooling/             # Centralized configuration presets (ESLint, Vitest, tsup)
│   └── try-catch/           # Functional error handling
├── .changeset/              # Automated versioning and changelog management
├── .github/workflows/       # GitHub Actions (CI & CD Release Pipelines)
├── turbo/                   # Monorepo package templates
├── .pretterrc.ts.           # Prettier configuration
├── eslint.config.ts         # Global ESLint entrypoint (Cascading rules)
├── vitest.config.ts         # Global Vitest entrypoint (Auto package mapping)
├── tsup.config.ts           # Global build presets for shared libraries
└── package.json             # Root orchestrator and global tasks
```

---

## 🔎 Backend For Frontend

The repository is also set up to evaluate different Backend For Frontend, BFF, architectures.

### Architectural Evaluation Matrix (planned so far)

| Criteria                         | Hono + htmx (in progress)                                       | Fastify + Datastar                                                  | Astro + htmx (+ Lit)                                                                 |
| :------------------------------- | :-------------------------------------------------------------- | :------------------------------------------------------------------ | :----------------------------------------------------------------------------------- |
| **Core Focus**                   | Ultra-lightweight, Edge-ready API/BFF                           | Robust, plugin-rich enterprise backend                              | Content-driven frontend, SSG/SSR hybrid                                              |
| **Client Updates**               | AJAX / HTML fragments                                           | SSE (Server-Sent Events) & Signals                                  | AJAX / HTML fragments & UI Islands                                                   |
| **Component Model**              | JSX (native via Hono)                                           | HTML string literals or JSX                                         | `.astro` files + Web Components                                                      |
| **Optimal For**                  | Low-latency, Edge/Cloudflare deployments                        | Complex real-time enterprise backends                               | SEO, documentation, hybrid content apps                                              |
| **Build Step**                   | Minimal / Optional                                              | Minimal / Standard Node compilation                                 | Required (Astro compiler & Vite optimization)                                        |
| **`@olsen-mon/core-css`**        | Injected globally or via component class strings                | Injected globally or via component class strings                    | Imported directly in `.astro` layouts or scoped inside Lit components                |
| **`@olsen-mono/object-builder`** | Used in Hono handlers to strictly initialize BFF domain objects | Used in Fastify hooks/routes to construct safe data payloads        | Used in server-side frontmatter to instantiate props safely before rendering         |
| **`@olsen-mono/reactive-state`** | Bridges with htmx via server-side state mutations               | Synchronizes perfectly with Datastar's client-side reactive signals | Powers local client-side state inside Lit islands, isolated from Astro's static HTML |
| **`@olsen-mono/pipe`**           | Processes data pipelines and HTML transformations sequentially  | Transforms data streams feeding into Server-Sent Events (SSE)       | Chains server-side data fetching and formatting before rendering the page            |

---

## 🛠 Tech Stack Core

- **Package Manager:** `pnpm >= 11.0.0` with absolute single-source-of-truth configuration (`packageManager` engine locks).
- **Orchestration:** `Turborepo v2` maximizing compiler efficiency using parallel execution graphs and cryptographic caching.
- **Backend Runtime:** `Node.js >= 26.0.0` allowing frictionless execution of native, non-polyfilled APIs like `Temporal` date-time engines.
- **Bundling & Compiling:** `tsdown` for standard library compilation (ESM) and `Vite` for localized application server-side building.
- **Quality Control:** `ESLint 10` (Flat Config) combined with `Prettier` and `Stylelint`, operating directly from the workspace root for macro-repo validation.

---

## 💻 Local Development Workflow

All core processes are optimized to utilize single-command global hot-reloading across interconnected libraries.

### Everyday Commands (Root Level)

- **`pnpm dev`**: Automatically builds out dependent workspaces, triggers internal asset sync, and hooks up Vite's HMR server alongside `vite-plugin-live-reload` on port `3000`.
- **`pnpm dev-package`**: Starts a single workspace package in development mode, e.g., `pnpm watch-pkg @olsen-mono/core-utils`.
- **`pnpm dev-htmx`**: Starts the `apps/hono-htmx` application in development mode.
- **`pnpm lint`**: Triggers immediate macro-analysis across all packages, configurations, and core root files (`--max-warnings 10`).
- **`pnpm test`**: Parallel test runner utilizing `Vitest` scoped natively inside isolated directories using internal workspace aliases.
- **`pnpm test-watch`**: Global live-updating testing environment capturing code state modifications continuously.
- **`pnpm build` / `pnpm compile`**: Compiles shared library workspaces down to production targets and bundles Hono into an standalone Server-Side Rendered (SSR) binary package.

---

## 🔄 Release & Lifecycle Operations

The architecture distinguishes between Pre-Merge Validation (**CI**) and Post-Merge Automation
(**Release**), safeguarded via GitHub Classic Branch Protection rules on `main`.

### 1. Feature Lifecycle

1. Create a workspace feature branch.
2. Introduce logic (e.g., inside `packages/my package`).
3. Execute `pnpm changeset` locally to declare version increment intent (`patch`/`minor`/`major`).
4. Commit both local logic and the `.changeset/*.md` artifact to your branch.
5. Create a GitHub PR. **`ci.yml`** triggers automated global validation tests.

### 2. Post-Merge Version Automation

1. Merging to `main` terminates the feature lifecycle and activates **`release.yml`**.
2. The pipeline registers the fresh changeset file and automatically generates a safe **"Version Packages" Pull Request**.
3. Merging the automated Version PR updates internal dependency numbers, writes localized logs (`CHANGELOG.md`), stamps semantic Git Tags, and handles publication workflows seamlessly.

---

## 📦 Create a new workspace package

1. Create a new workspace package using the `turbo` template: `pnpm turbo`.
2. Follow the prompts to configure the new package.
3. Inspect the generated `package.json` and `tsconfig.json` files for further configuration.
4. Then follow the Feature Lifecycle steps above.

---

## 📦 Client Asset Sync (HTMX Automation). WIP: Move to `apps/hono-htmx`

To achieve 100% self-contained, air-gapped deployments without external CDN runtime dependencies, `apps/hello-htmx` automatically bridges backend resources to public nodes:

- A dedicated synchronization routine (`scripts/copy-htmx.js`) automatically binds to the `pnpm dev` and `pnpm build` cycles.
- It dynamically resolves the targeted `htmx.org` binaries inside the internal storage structures and mirrors it directly to `public/js/htmx.min.js`.
- This architecture enables the server component runtime environments to safely reference local standalone browser layouts directly:
  ```html
  <script src="/js/htmx.min.js"></script>
  ```

## 📝 Automated API Documentation

This monorepo automatically generates and syncs API documentation directly from TypeScript source code source-of-truth via [TypeDoc](https://typedoc.org) and [typedoc-plugin-markdown](https://typedoc-plugin-markdown.org).

### 🏛️ Architecture & Philosophy

To keep package overhead at a absolute minimum, we utilize an **anemic package philosophy**:

---
