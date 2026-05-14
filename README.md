# Olsen-Mono - WIP

A modern, high-performance monorepo architecture built with **TypeScript 6**, **pnpm workspaces**,
**Turborepo**, **Vite**, **Hono**, and **HTMX**, optimized for **Node.js 26**.

## 🏗 Architecture & Workspace Structure

The project uses a hybrid-minimalist setup. Shared configuration logic lives in a dedicated internal tooling package, keeping individual workspace definitions extremely thin and maintainable.

```text
olsen-mono/
├── apps/
│   └── hello-htmx/          # Hono + HTMX web application (Vite-powered SSR)
├── packages/
│   ├── core-utils/          # Shared utility functions (Node 26 native Temporal)
│   ├── try-catch/           # Functional error handling utilities (Private)
│   └── tooling/             # Centralized configuration presets (ESLint, Vitest, tsup)
├── .changeset/              # Automated versioning and changelog management
├── .github/workflows/       # GitHub Actions (CI & CD Release Pipelines)
├── eslint.config.ts         # Global ESLint entrypoint (Cascading rules)
├── vitest.config.ts         # Global Vitest entrypoint (Auto package mapping)
├── tsup.config.ts           # Global build presets for shared libraries
└── package.json             # Root orchestrator and global tasks
```

---

## 🛠 Tech Stack Core

- **Package Manager:** `pnpm@10` with absolute single-source-of-truth configuration (`packageManager` engine locks).
- **Orchestration:** `Turborepo v2` maximizing compiler efficiency using parallel execution graphs and cryptographic caching.
- **Backend Runtime:** `Node.js >= 26.0.0` allowing frictionless execution of native, non-polyfilled `Temporal` date-time engines.
- **Bundling & Compiling:** `tsup` for standard library compilation (ESM) and `Vite` for localized application server-side building.
- **Quality Control:** `ESLint 10` (Flat Config) combined with `Prettier` and `Stylelint`, operating directly from the workspace root for macro-repo validation.

---

## 💻 Local Development Workflow

All core processes are optimized to utilize single-command global hot-reloading across interconnected libraries.

### Everyday Commands (Root Level)

- **`pnpm dev`**: Automatically builds out dependent workspaces, triggers internal asset sync, and hooks up Vite's HMR server alongside `vite-plugin-live-reload` on port `3000`.
- **`pnpm lint`**: Triggers immediate macro-analysis across all packages, configurations, and core root files (`--max-warnings 10`).
- **`pnpm test`**: Parallel test runner utilizing `Vitest` scoped natively inside isolated directories using internal workspace aliases.
- **`pnpm test-watch`**: Global live-updating testing environment capturing code state modifications continuously.
- **`pnpm build` / `pnpm compile`**: Compiles shared library workspaces down to production targets and bundles Hono into an standalone Server-Side Rendered (SSR) binary package.

---

## 🔄 Release & Lifecycle Operations

The architecture distinguishes between Pre-Merge Validation (**CI**) and Post-Merge Automation (**Release**), safeguarded via GitHub Classic Branch Protection rules on `main`.

### 1. Feature Lifecycle

1. Create a workspace feature branch.
2. Introduce logic (e.g., inside `packages/core-utils`).
3. Execute `pnpm changeset` locally to declare version increment intent (`patch`/`minor`/`major`).
4. Commit both local logic and the `.changeset/*.md` artifact to your branch.
5. Create a GitHub PR. **`ci.yml`** triggers automated global validation tests.

### 2. Post-Merge Version Automation

1. Merging to `main` terminates the feature lifecycle and activates **`release.yml`**.
2. The pipeline registers the fresh changeset file and automatically generates a safe **"Version Packages" Pull Request**.
3. Merging the automated Version PR updates internal dependency numbers, writes localized logs (`CHANGELOG.md`), stamps semantic Git Tags, and handles publication workflows seamlessly.

---

## 📦 Client Asset Sync (HTMX Automation)

To achieve 100% self-contained, air-gapped deployments without external CDN runtime dependencies, `apps/hello-htmx` automatically bridges backend resources to public nodes:

- A dedicated synchronization routine (`scripts/copy-htmx.js`) automatically binds to the `pnpm dev` and `pnpm build` cycles.
- It dynamically resolves the targeted `htmx.org` binaries inside the internal storage structures and mirrors it directly to `public/js/htmx.min.js`.
- This architecture enables the server component runtime environments to safely reference local standalone browser layouts directly:
  ```html
  <script src="/js/htmx.min.js"></script>
  ```
