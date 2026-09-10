# Olsen-Mono

A modern, high-performance monorepo architecture built with **TypeScript 6**, **tsdown**,
**pnpm workspaces**, **Turborepo**, **Astro** and **Vite**, optimized for **Node.js 26**.

---

## 🏗 Development Setup

This monorepo requires **Node.js v26** and **pnpm v12**. To avoid configuration conflicts with Turborepo and global
binary execution, we manage Node versions using a version manager.

Follow the steps below depending on your Operating System.

### 💻 macOS Setup

⚠️ **Note:** Do **NOT** install `pnpm` or `nvm` via `npm install -g`‼️

If you have a global installation of pnpm and nvm, it will conflict with the standalone installer. To uninstall, see the
migration guide below for more information:

#### 1. Install Homebrew (if not already installed)

Open your terminal and run:

```bash
/bin/bash -c "\$(curl -fsSL https://githubusercontent.com)"
```

#### 2. Install pnpm via Homebrew

Installing `pnpm` through Homebrew provides a native, independent binary that bypasses standard npm execution
limitations:

```bash
brew install pnpm
```

#### 3. Install Node Version Manager (nvm)

Install the official `nvm` script to handle your Node environments cleanly:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
```

_Restart your terminal session (`exec zsh`) after installation._

#### 4. Install and Lock Node 26

Use `nvm` to download Node 26 and set it as your system default:

```bash
nvm install 26
nvm use 26
nvm alias default 26
```

---

### Migrating to Standalone nvm and pnpm (macOS)

Follow these steps to completely uninstall the legacy nvm- and pnpm versions and install the robust standalone
alternatives.

#### 1: Remove the global nvm binaries

```bash
npm uninstall -g nvm
```

#### 2: Remove the nvm directory

```bash
rm -rf ~/.nvm
```

#### 3: Clean the shell environment

Open your terminal profile in a text editor. On modern macOS (using Zsh), this is usually .zshrc.

```bash
nano ~/.zshrc
```

Scroll through the file and look for a block of code that looks like this:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

Delete those lines.

Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit the nano editor.

For the changes to take effect, close your current terminal window and open a new one, or force-refresh your shell:

```bash
source ~/.zshrc
```

To verify it is completely gone, type `nvm`. You should see a `command not found: nvm error` message..

#### 4: Remove the global pnpm CLI

```bash
npm uninstall -g pnpm
```

#### 5: Verify it is gone

```bash
which pnpm
```

If it returns nothing, the main executable has been successfully removed.

#### 6: Clean up leftover global directories and store

```bash
# Remove the local pnpm state and global configuration
rm -rf ~/.local/share/pnpm
rm -rf ~/.config/pnpm

# Remove the global content-addressable store cache
rm -rf ~/Library/Caches/pnpm
```

#### 7: Remove Environment Variables

Open your shell configuration file.

```bash
nano ~/.zshrc
```

Look for a block of code that looks like this and delete it:

```bash
# pnpm
export PNPM_HOME="/Users/yourusername/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end
```

Save and exit (Press `Ctrl + O`, `Enter`, then `Ctrl + X`)

Apply the changes to your current terminal session:

```bash
source ~/.zshrc
```

---

### 🪟 Windows Setup

⚠️ **Note:** Do **NOT** install `pnpm` or `nvm` via `npm install -g`‼️

If you have a global installation of pnpm and nvm, it will conflict with the standalone installer. To uninstall, see the
migration guide below for more information:

#### 1. Install pnpm via Standalone Script

Open **PowerShell** as an Administrator and run the official [pnpm standalone installer](https://pnpm.io/installation#on-windows):

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

#### 2. Install NVM for Windows

Windows users must use `nvm-windows` since the Unix bash script does not work natively.

1. Download the latest installer (`nvm-setup.exe`) from the [nvm-windows releases page](https://github.com).
2. Run the installer and complete the setup.
3. Open a **new** PowerShell or Command Prompt window.

#### 3. Install and Lock Node 26

Run the following commands in your terminal:

```powershell
nvm install 26
nvm use 26
```

---

### Migrating to Standalone NVM and pnpm (Windows)

If you previously installed `nvm` or `pnpm` globally via `npm install -g`, it creates circular dependencies tied to a specific Node.js version. Follow this guide to completely uninstall the legacy versions and install the robust standalone alternatives.

---

#### Part 1: Uninstall Legacy Packages

First, remove the globally managed packages from your active Node instance and clear stale files.

1. **Remove via npm:**

   ```powershell
   npm uninstall -g pnpm nvm
   ```

2. **Remove Residual Global Folders:**
   Manually delete or use terminal commands to remove the following directories if they exist:

- `%AppData%\npm\` (Check for and delete any remaining `pnpm` or `nvm` binaries/shims)
- `%USERPROFILE%\.pnpm-store\` (Optional, removes cached packages to start fresh)

3. **Troubleshooting Locked Folders:**
   If Windows throws a _Permission Denied_ or _File in use_ error due to an administrative symlink created by NVM, open **PowerShell as Administrator** and force-delete the specific legacy executable using its absolute path:
   ```powershell
   Remove-Item -Path "C:\Users\<YourUsername>\AppData\Local\Author Software\nvm\.nodejs\pnpm.exe" -Force
   ```

---

#### Part 2: Standalone Installation & Configuration

Always install NVM first, as it handles the underlying Node.js runtimes, followed by pnpm which runs completely independently.

##### 1. Install nvm-windows (v2.0.0+)

1. Download `nvm-setup.exe` from the official GitHub repository: [coreybutler/nvm-windows/releases](https://github.com).
2. Run the installer and complete the setup wizard.
3. Open a **new** PowerShell window and verify the installation:
   ```powershell
   nvm version
   ```
4. Install and activate your desired Node.js version:
   ```powershell
   nvm install lts
   nvm use <version_number>
   ```

##### 2. Install pnpm (Manual Standalone Executable)

To prevent the installation script from accidentally latching onto NVM's temporary path variables, download the official standalone executable directly into a dedicated directory.

1. Open a **standard PowerShell window** (not as administrator) and run:
   ```powershell
   # Create a clean directory for pnpm
   New-Item -ItemType Directory -Force -Path "C:\Users\<YourUsername>\AppData\Local\pnpm"

   # Download the latest standalone executable
   Invoke-WebRequest -Uri "https://github.com" -OutFile "C:\Users\<YourUsername>\AppData\Local\pnpm\pnpm.exe" -UseBasicParsing
   ```

##### 3. Configure Windows Environment Variables

Register the custom installation directory and establish the global bin repository for your global CLI packages.

1. Run the following commands in PowerShell to update your user profile path:

   ```powershell
   # Register the main pnpm executable path
   [Environment]::SetEnvironmentVariable("PATH", [Environment]::GetEnvironmentVariable('PATH', 'User') + ';C:\Users\<YourUsername>\AppData\Local\pnpm', 'User')

   # Set PNPM_HOME to the core directory
   [Environment]::SetEnvironmentVariable("PNPM_HOME", "C:\Users\<YourUsername>\AppData\Local\pnpm", "User")

   # Register the future global bin folder in PATH
   [Environment]::SetEnvironmentVariable("PATH", [Environment]::GetEnvironmentVariable('PATH', 'User') + ';C:\Users\<YourUsername>\AppData\Local\pnpm\bin', 'User')
   ```

2. Link pnpm's internal configuration to use the newly created bin folder:
   ```powershell
   pnpm config set global-bin-dir "C:\Users\<YourUsername>\AppData\Local\pnpm\bin"
   ```

---

#### Part 3: Verification

Close all terminal windows and open a **fresh PowerShell window** to test that the standalone stack is functioning correctly.

```powershell
# Verify NVM
where.exe nvm
# Target output: ...\AppData\Local\Author Software\nvm\nvm.exe

# Verify pnpm
pnpm -v
where.exe pnpm
# Target output: ...\AppData\Local\pnpm\pnpm.exe

# Test installing a global package
pnpm add -g npm-check-updates
ncu --version
```

---

### 🚀 Verifying and Running the Monorepo

Regardless of your OS, verify your active versions:

```bash
# Should return /opt/homebrew/bin/pnpm (macOS) or a local AppData path (Windows)
which pnpm

# Should return v26
node -v
```

---

### Clone the Repository

```bash
git clone https://github.com/Telenor-Maritime/uds-frontend.git
```

Navigate to the `uds-frontend` project root and bootstrap the monorepo dependencies and execute Turborepo build steps:

```bash
# Install dependencies
pnpm install

# Run compile, typecheck, test, lint via Turborepo
pnpm build
```

---

## Add the Biome plugin to your editor of choice

[Biome](https://biomejs.dev/) is a code formatter for JavaScript, TypeScript, CSS, and more.
Biome replaces Prettier, EsLint, and other code formatters.

Configure Biome to automatically format your code on save.

⚠️ **Note:** Remove _astro and md(x) files_ from the plugins file list. This is because Biome is currently not fully
supported for Astro and Markdown files.

---

## Add the Prettier plugin to your editor of choice

[Prettier](https://prettier.io/) is an opinionated code formatter that automatically enforces a consistent visual style
across your codebase.

Prettier is used for formatting Astro and md(x) files, until Biome's formatter fully supports Astro and Markdown files.

Configure the Prettier plugin to format only `*.astro` and `*.md(x)` files on save.

---

## 🏗 Architecture & Workspace Structure

The project uses a hybrid-minimalist setup. Shared configuration logic lives in a dedicated
internal tooling package, keeping individual workspace definitions "anemic" and maintainable.

```text
olsen-mono/
├── apps/
│   └── astro-htmx/          # Astro + HTMX web application
├── packages/
│   ├── core-utils/          # Shared utility functions
│   ├── css-foundation/      # Modern css reset and type setting utilizing the W3C Design Tokens Standard via Open Props
│   ├── css-to-dts/          # CLI tool tailored for `pnpm` monorepos to automatically generate TypeScript definitions (`*.css.d.ts`) from CSS files
│   ├── object-builder/      # Typesafe builder pattern for object literals
│   ├── reactive-state/      # Reactive state factory
│   └── tooling/             # Centralized configuration presets (vitest, tsdown)
├── .changeset/              # Automated versioning and changelog management
├── .github/workflows/       # GitHub Actions (CI & CD Release Pipelines)
├── turbo/                   # Monorepo package templates
├── biome.json               # Biome configuration
├── vitest.config.ts         # Global Vitest entrypoint (Auto package mapping)
├── tsdown.config.ts         # Global build presets for shared libraries
└── package.json             # Root orchestrator and global tasks
```

---

## 🛠 Tech Stack Core

- **Package Manager:** `pnpm >= 12.0.0` with absolute single-source-of-truth configuration (`packageManager` engine locks).
- **Orchestration:** `Turborepo v2` maximizing compiler efficiency using parallel execution graphs and cryptographic caching.
- **Backend Runtime:** `Node.js >= 26.0.0` allowing frictionless execution of native, non-polyfilled APIs like `Temporal` date-time engines.
- **Bundling & Compiling:** `tsdown` for standard library compilation (ESM) and `Vite` for localized application server-side building.
- **Quality Control:** `Biome` for linting and `Vitest` for testing.
- **Versioning:** `Changeset` for automated versioning and changelog generation.
- **Continuous Integration:** `GitHub Actions` for automated testing, linting, and release pipelines.

---

## 💻 Local Development Workflow

All core processes are optimized to utilize single-command global hot-reloading across interconnected libraries.

### Everyday Commands (Root Level)

- **`pnpm dev`**: Automatically builds out dependent workspaces, triggers internal asset sync, and hooks up Vite's HMR server alongside `vite-plugin-live-reload` on port `3000`.
- **`pnpm dev-package`**: Starts a single workspace package in development mode, e.g., `pnpm watch-pkg @olsen-mono/core-utils`.
- **`pnpm lint`**: Triggers immediate macro-analysis across all packages, configurations, and core root files (`--max-warnings 10`).
- **`pnpm test`**: Parallel test runner utilizing `Vitest` scoped natively inside isolated directories using internal workspace aliases.
- **`pnpm test-watch`**: Global live-updating testing environment capturing code state modifications continuously.
- **`pnpm build` / `pnpm compile`**: Compiles shared library workspaces down to production targets and bundles astro-htmx into an standalone Server-Side Rendered (SSR) binary package.

---

## 🔄 Release & Lifecycle Operations

The architecture distinguishes between Pre-Merge Validation (**CI**) and Post-Merge Automation
(**Release**), safeguarded via GitHub Classic Branch Protection rules on `main`.

### 1. Feature Lifecycle

1. Create a workspace feature branch.
2. Introduce logic (e.g., inside `packages/my package`).
3. Run `pnpm build` to validate and build your changes.
4. Execute `pnpm changeset` locally to declare version increment intent (`patch`/`minor`/`major`).
5. Commit both local logic and the `.changeset/*.md` artifact to your branch.
6. Create a GitHub PR. **`ci.yml`** triggers automated global validation tests.

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

## 📦 Client Asset Sync (HTMX Automation).

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

## Dry Run

```bash
# 1. Commit local changes
git commit

# 2. Run changeset and follow the instructions in the terminal to
# select the package(s) you have modified, e.g., @olsen-mono/core-utils.
pnpm changeset

# 2. Dry run: Report changed packages
pnpm changeset-dry

# 3.Update versions in local packages, optional
pnpm version-packages

# 4. Restore versionig of local packages
git restore .
git clean -fd .changeset/

```

---

## Cleaning up Turborepo

To drop all node_modules and completely reinstall everything across the monorepo, delete the workspace
root `node_modules`, all package-level `node_modules`, and the local pnpm stores before running a fresh installation.

Run the following commands in the root directory:

```bash
# 1. Delete all node_modules recursively across the workspace
pnpm -r exec shx rm -rf node_modules

# 2. Delete the root node_modules and lockfile (optional but recommended for a total reset)
shx rm -rf node_modules pnpm-lock.yaml

# 3. Clear the local pnpm store cache to ensure fresh downloads
pnpm store prune

# 4. Perform a completely fresh installation
pnpm install
```

---

## Pnpm

Useful pmpm commands.

```bash
# List outdated dependencies
pnpm outdated -r

# Updated dependencies located in package.json or pnpm-workspace.yaml
pnpm update -r --latest <package-name>

# Update dependencies located in pnpm-workspace.yaml, e.g. astro
pnpm update astro @astrojs/node -r --latest

# Bypass cache
pnpm compile --force
```
