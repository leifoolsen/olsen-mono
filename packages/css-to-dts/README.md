# @olsen-mono/css-to-dts

> A lightweight, high-performance CLI tool tailored for `pnpm` monorepos to automatically generate TypeScript definitions (`*.css.d.ts`) from CSS files.
> It extracts CSS classes and custom properties (CSS variables), allowing you to write fully type-safe styles in your TypeScript applications.

## Why

[typed-css-modules](https://github.com/Quramy/typed-css-modules) did not work with Node 26.

## Features

- **Automated Type Generation**: Scans folders recursively and outputs strongly typed `.d.ts` wrappers for your CSS.
- **Smart Cleanup**: Automatically removes orphaned `.css.d.ts` files if the source `.css` file is deleted or renamed.
- **Performance Optimized**: Built using modern ECMAScript Modules (ESM) and supports Turborepo caching.
- **Zero Configuration**: Works out-of-the-box by passing a target directory argument.

## Installation

This package is intended to be used as a development tool within the monorepo workspace.

```bash
pnpm --filter @olsen-mono/your-app add -D @olsen-mono/css-to-dts
```

## Usage

### Local Package Configuration

To use the tool inside an application or a package, add a `precompile` hook to trigger the CLI automatically before building your application.

Update your local `package.json`:

#### If your package contains both CSS and TypeScript files:

```json
{
  "scripts": {
    "clean": "rimraf lib",
    "css-to-dts": "css-to-dts src",
    "precompile": "pnpm run clean & pnpm run css-to-dts",
    "compile": "tsdown && cpy \"**/*.{css,css.d.ts}\" ../dist --cwd=src --parents"
  }
}
```

#### If your package only contains CSS files:

```json
{
  "scripts": {
    "clean": "rimraf lib",
    "css-to-dts": "css-to-dts src",
    "precompile": "pnpm run clean & pnpm run css-to-dts",
    "compile": "cpy \"**/*.{css,css.d.ts}\" ../dist --cwd=src --parents"
  }
}
```

### Generated Output Example

Given a source CSS file `styles.css`:

```css
:root {
  --primary-color: #0070f3;
}

.btn-submit {
  color: var(--primary-color);
}
```

The tool will emit a `styles.css.d.ts` sidecar file containing:

```typescript
export type Css = 'btn-submit';
export type CssVariables = '--primary-color';
declare const styles: string;
export default styles;
```

## Development and Testing

The package includes a integration test suite powered by Vitest, verifying token extraction and file cleanup
against a mocked filesystem environment.

### Run Tests

To run the tests for this package locally:

```bash
pnpm --filter @olsen-mono/css-to-dts test
```

### Building the CLI

To compile the TypeScript source file into executable ESM code (`dist/css-to-dts.mjs`), run:

```bash
pnpm --filter @olsen-mono/css-to-dts compile
```
