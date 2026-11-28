# astro-htmx

## 0.0.24

### Patch Changes

- c7ff9df: Simplified configuration and enhanced color token management.
  
  This PR centralizes monorepo tooling and replaces the shared color system with expanded design tokens. It also reorganizes form styles and updates the design-system app to demonstrate the new styling APIs.
  
  **Changes:**
  
  - Consolidates Turbo, Vitest, linting, and type-check commands.
  - Introduces color, surface, shadow, and input tokens; splits form CSS into smaller modules.
  - Adds dedicated design-system sample pages and shared navigation.
  
  | File                                                            | Description                                              |
  | --------------------------------------------------------------- | -------------------------------------------------------- |
  | `vitest.workspace.ts`                                           | Removes the previous workspace configuration.            |
  | `vitest.config.ts`                                              | Adds root test-project configuration.                    |
  | `turbo.json`                                                    | Centralizes task dependencies and caching configuration. |
  | `tools/tooling/vitest.base.ts`                                  | Updates shared test defaults and aliases.                |
  | `tools/tooling/vitest-astro.ts`                                 | Merges Astro tests with shared defaults.                 |
  | `tools/tooling/vitest-astro-app.ts`                             | Adds separate Astro and Node test projects.              |
  | `tools/tooling/package.json`                                    | Exports the Astro app test helper.                       |
  | `tools/css-to-dts/package.json`                                 | Updates coverage and type-check scripts.                 |
  | `README.md`                                                     | Corrects a documentation typo.                           |
  | `pnpm-workspace.yaml`                                           | Removes Turbo release-age exceptions.                    |
  | `packages/css-foundation/src/typography.css.d.ts`               | Updates typography and shadow attribute types.           |
  | `packages/css-foundation/src/typography.css`                    | Revises scales, weights, and shadow utilities.           |
  | `packages/css-foundation/src/typesetting.css.d.ts`              | Adds types for typesetting attributes.                   |
  | `packages/css-foundation/src/typesetting.css`                   | Updates text, input, and focus styling.                  |
  | `packages/css-foundation/src/reset.css`                         | Adds cursor and touch defaults.                          |
  | `packages/css-foundation/src/main.css`                          | Imports the replacement color-token stylesheet.          |
  | `packages/css-foundation/src/colors.css.d.ts`                   | Removes obsolete color declarations.                     |
  | `packages/css-foundation/src/colors.css`                        | Removes the previous color system.                       |
  | `packages/css-foundation/src/color-tokens.css.d.ts`             | Adds declarations for new color tokens.                  |
  | `packages/css-foundation/src/color-tokens.css`                  | Defines palettes, surfaces, contrast, and shadows.       |
  | `packages/css-foundation/package.json`                          | Exports the new color-token stylesheet.                  |
  | `packages/core-utils/package.json`                              | Adopts centralized linting and renamed type-checking.    |
  | `packages/astro-test-utils/package.json`                        | Adopts centralized linting and renamed type-checking.    |
  | `packages/astro-svg/src/SvgIcon.astro`                          | Removes broad `any` casts.                               |
  | `packages/astro-svg/src/MorphLinesIcon.astro`                   | Removes the default `active` value.                      |
  | `packages/astro-svg/package.json`                               | Separates Astro and TypeScript checks.                   |
  | `packages/astro-forms/src/ToggleSwitch.astro`                   | Moves switch styling into the component.                 |
  | `packages/astro-forms/src/TextInput.astro`                      | Updates validation handling and local styling.           |
  | `packages/astro-forms/src/TextAreaInput.astro`                  | Updates validation handling and textarea styling.        |
  | `packages/astro-forms/src/SelectInput.astro`                    | Updates validation handling and select styling.          |
  | `packages/astro-forms/src/RangeInput.astro`                     | Moves range styling into the component.                  |
  | `packages/astro-forms/src/RadioSet.astro`                       | Uses extracted CSS and boolean validation handling.      |
  | `packages/astro-forms/src/RadioButton.astro`                    | Updates slotted labels and stylesheet imports.           |
  | `packages/astro-forms/src/listbox.ts`                           | Updates text extraction and disabled-option handling.    |
  | `packages/astro-forms/src/listbox.css.d.ts`                     | Removes relocated combobox class declarations.           |
  | `packages/astro-forms/src/listbox.css`                          | Refreshes listbox styling with shared tokens.            |
  | `packages/astro-forms/src/LegendLabel.astro`                    | Removes the old shared stylesheet import.                |
  | `packages/astro-forms/src/Label.astro`                          | Moves label styling into the component.                  |
  | `packages/astro-forms/src/InputSet.astro`                       | Updates validation and description rendering.            |
  | `packages/astro-forms/src/InputGroup.astro`                     | Imports extracted group styles.                          |
  | `packages/astro-forms/src/InputControl.astro`                   | Imports control styles and marks focus containers.       |
  | `packages/astro-forms/src/input-group.css.d.ts`                 | Adds group-style declarations.                           |
  | `packages/astro-forms/src/input-group.css`                      | Extracts group layouts and validation styling.           |
  | `packages/astro-forms/src/input-control.css.d.ts`               | Adds control-style declarations.                         |
  | `packages/astro-forms/src/input-control.css`                    | Extracts shared control styling and states.              |
  | `packages/astro-forms/src/FormToolButton.astro`                 | Removes legacy stylesheet and cursor declarations.       |
  | `packages/astro-forms/src/forms.css.d.ts`                       | Removes monolithic form-style declarations.              |
  | `packages/astro-forms/src/forms.css`                            | Removes the monolithic form stylesheet.                  |
  | `packages/astro-forms/src/forms-tokens.css.d.ts`                | Updates form sizing-token declarations.                  |
  | `packages/astro-forms/src/forms-tokens.css`                     | Simplifies tokens to control dimensions.                 |
  | `packages/astro-forms/src/FormDescription.astro`                | Updates icon sizing and popover styling.                 |
  | `packages/astro-forms/src/fieldset.css.d.ts`                    | Adds fieldset-style declarations.                        |
  | `packages/astro-forms/src/fieldset.css`                         | Extracts fieldset styling.                               |
  | `packages/astro-forms/src/Fieldset.astro`                       | Imports extracted fieldset styles.                       |
  | `packages/astro-forms/src/ErrorMessage.astro`                   | Adds component-local error styling.                      |
  | `packages/astro-forms/src/ComponentLayout.astro`                | Removes the old shared stylesheet import.                |
  | `packages/astro-forms/src/combobox.ts`                          | Uses `textContent` for selected labels.                  |
  | `packages/astro-forms/src/Combobox.astro`                       | Localizes combobox styles and renames classes.           |
  | `packages/astro-forms/src/Checkbox.astro`                       | Updates validation and extracted stylesheet usage.       |
  | `packages/astro-forms/src/checkbox-radio.css.d.ts`              | Adds checkbox and radio style declarations.              |
  | `packages/astro-forms/src/checkbox-radio.css`                   | Extracts checkbox, radio, and radio-set styling.         |
  | `packages/astro-forms/src/__tests__/utils.test.ts`              | Revises a test description only.                         |
  | `packages/astro-forms/package.json`                             | Updates CSS exports and check scripts.                   |
  | `package.json`                                                  | Centralizes commands and updates tooling dependencies.   |
  | `biome.jsonc`                                                   | Revises file coverage and Astro linting.                 |
  | `apps/design-system/vitest.config.ts`                           | Configures Astro and API test projects.                  |
  | `apps/design-system/turbo.json`                                 | Removes app-specific task configuration.                 |
  | `apps/design-system/src/styles/style.css`                       | Imports the new color tokens.                            |
  | `apps/design-system/src/styles/app-layout.css.d.ts`             | Removes relocated layout declarations.                   |
  | `apps/design-system/src/styles/app-layout.css`                  | Removes styles moved into the layout component.          |
  | `apps/design-system/src/pages/typography.astro`                 | Adds the typography sample page.                         |
  | `apps/design-system/src/pages/sizes.astro`                      | Adds sizing and spacing demonstrations.                  |
  | `apps/design-system/src/pages/shadows.astro`                    | Adds the shadow sample page.                             |
  | `apps/design-system/src/pages/morph-icons.astro`                | Updates icon previews and event handling.                |
  | `apps/design-system/src/pages/index.astro`                      | Reuses shared application navigation.                    |
  | `apps/design-system/src/pages/form-elements.astro`              | Expands examples and adopts new tokens.                  |
  | `apps/design-system/src/pages/colors.astro`                     | Adds the color-token sample page.                        |
  | `apps/design-system/src/pages/404.astro`                        | Adds a styled not-found page.                            |
  | `apps/design-system/src/layouts/BaseLayout.astro`               | Adds stored color-scheme metadata initialization.        |
  | `apps/design-system/src/layouts/AppLayout.astro`                | Localizes layout styles and adopts surface tokens.       |
  | `apps/design-system/src/components/TextSamples.astro`           | Adds semantic text demonstrations.                       |
  | `apps/design-system/src/components/SurfaceSamples.astro`        | Demonstrates surface variants and shades.                |
  | `apps/design-system/src/components/SpacingSamples.astro`        | Visualizes spacing tokens.                               |
  | `apps/design-system/src/components/ShadowSamples.astro`         | Demonstrates outer and inset shadows.                    |
  | `apps/design-system/src/components/FontSizeSamples.astro`       | Demonstrates font-size tokens and attributes.            |
  | `apps/design-system/src/components/ColorVariantSamples.astro`   | Demonstrates contextual colors and input tokens.         |
  | `apps/design-system/src/components/ColorSwatchSamples.astro`    | Displays palette shades and text contrasts.              |
  | `apps/design-system/src/components/BorderRadiusSamples.astro`   | Demonstrates border-radius utilities.                    |
  | `apps/design-system/src/components/ApplicationMenu.astro`       | Adds reusable sample-page navigation.                    |
  | `apps/design-system/src/components/__tests__/fake-test.test.ts` | Adds a placeholder passing test.                         |
  | `apps/design-system/package.json`                               | Aligns build and test scripts.                           |
  | `.prettierrc.mjs`                                               | Adds a filename comment only.                            |
  | `.idea/prettier.xml`                                            | Enables automatic Prettier configuration.                |
- Updated dependencies [c7ff9df]
  - @olsen-mono/astro-forms@0.0.11
  - @olsen-mono/astro-svg@0.0.12
  - @olsen-mono/core-utils@0.0.29
  - @olsen-mono/css-foundation@0.0.22

## 0.0.23

### Patch Changes

- 22318a9: Added vitest-app.ts for Astro Web App test configuration. Improved test coverage setup.

## 0.0.22

### Patch Changes

- 2c6cb7b: Improved workflows to include linting. Added linting tasks to turbo build task.
- Updated dependencies [2c6cb7b]
  - @olsen-mono/astro-forms@0.0.10
  - @olsen-mono/astro-svg@0.0.11
  - @olsen-mono/core-utils@0.0.28
  - @olsen-mono/css-foundation@0.0.21

## 0.0.21

### Patch Changes

- f3d94d1: Uses isomorphic-dompurify to sanitize <svg> elements.
- Updated dependencies [f3d94d1]
  - @olsen-mono/astro-svg@0.0.10
  - @olsen-mono/astro-forms@0.0.9

## 0.0.20

### Patch Changes

- 8c99573: Renamed Svg.astro to SvgIcon.astro, and improved XSS check. Added LinesIcon.astro
- Updated dependencies [8c99573]
  - @olsen-mono/astro-forms@0.0.8
  - @olsen-mono/astro-svg@0.0.9

## 0.0.19

### Patch Changes

- 41fd28f: Merged @olsen-mono/astro-morph-icons into @olsen-mono/astro-svg and updated package.json references.
- Updated dependencies [41fd28f]
  - @olsen-mono/astro-forms@0.0.7
  - @olsen-mono/astro-svg@0.0.8

## 0.0.18

### Patch Changes

- f131031: copilot code fixes
- Updated dependencies [f131031]
  - @olsen-mono/astro-forms@0.0.6
  - @olsen-mono/astro-morph-icons@0.0.4
  - @olsen-mono/astro-svg@0.0.7
  - @olsen-mono/core-utils@0.0.27
  - @olsen-mono/css-foundation@0.0.20

## 0.0.17

### Patch Changes

- 1f3f246: Renamed MorphLineIcon to MorphLinesIcon. Added typecheck to lint step. Removed unnecessary .ts from imports.
- Updated dependencies [1f3f246]
  - @olsen-mono/astro-forms@0.0.5
  - @olsen-mono/astro-morph-icons@0.0.3
  - @olsen-mono/astro-svg@0.0.6
  - @olsen-mono/core-utils@0.0.26

## 0.0.16

### Patch Changes

- 80dad0e: Renamed MorphIcon to MorphLinesIcon. Added interactive page for morph line icons.
- Updated dependencies [80dad0e]
  - @olsen-mono/astro-forms@0.0.4
  - @olsen-mono/astro-morph-icons@0.0.2
  - @olsen-mono/astro-svg@0.0.5
  - @olsen-mono/core-utils@0.0.25

## 0.0.15

### Patch Changes

- f925ac5: Created astro-morph-icons package
- Updated dependencies [f925ac5]
  - @olsen-mono/astro-forms@0.0.3
  - @olsen-mono/astro-morph-icons@0.0.1
  - @olsen-mono/astro-svg@0.0.4
  - @olsen-mono/css-foundation@0.0.19

## 0.0.14

### Patch Changes

- f65a88b: - Addded custom Google fonts: Titillum Web, Open Sans and SUSE Mono
  - Removed redundant dependencies
  - Removed redundant dependencies
  - Fixed astro check errors
  - Improved TS configuration and Astro check.
- Updated dependencies [f65a88b]
  - @olsen-mono/astro-forms@0.0.2
  - @olsen-mono/astro-svg@0.0.3
  - @olsen-mono/css-foundation@0.0.18

## 0.0.13

### Patch Changes

- c34d46e: Renamed astro-htmx to astro-design-system

## 0.0.12

### Patch Changes

- 5d9dd63: Moved form elements to packages/astro-forms
- Updated dependencies [5d9dd63]
  - @olsen-mono/astro-forms@0.0.1
  - @olsen-mono/astro-svg@0.0.2
  - @olsen-mono/core-utils@0.0.24
  - @olsen-mono/css-foundation@0.0.17

## 0.0.11

### Patch Changes

- 5afbc2e: Added astro-svg package. Added astro-test-utils package. Improved JIT/no-build config.
- 991be98: Added astro-svg package. Added astro-test-utils package. Improved JIT/no-build config.
- Updated dependencies [5afbc2e]
- Updated dependencies [991be98]
  - @olsen-mono/astro-svg@0.0.1
  - @olsen-mono/core-utils@0.0.23
  - @olsen-mono/css-foundation@0.0.16

## 0.0.10

### Patch Changes

- 01578ca: Modified package export i all packages for improved JIT/no-build. Improved generated typing of CSS. Introduced --camelCase and --watch flag. Added script to watch changes in CSS files. Normalized eol by adding .gitattributes file. Replaced copyfiles with shx. Improved dry-run.
- dd868fa: Fixed flaws in config files that caused ci to fail
- Updated dependencies [01578ca]
- Updated dependencies [dd868fa]
  - @olsen-mono/core-utils@0.0.22
  - @olsen-mono/css-foundation@0.0.15

## 0.0.9

### Patch Changes

- ec254fc: Added Prettier for linting of *.astro and *.md files
- Updated dependencies [ec254fc]
  - @olsen-mono/core-utils@0.0.21
  - @olsen-mono/css-foundation@0.0.14

## 0.0.8

### Patch Changes

- a8a23d2: apps/astro-htmx/astro.config.mjs: Improved config for no-build. tsconfig.json: Added separate paths for each package in packages.

## 0.0.7

### Patch Changes

- e541538: Updated .changeset/config.json to allow versioning of private packages. Improved ./github/workflows files. Added .vscode config for Biome and Prettier.  Added prettier for linting of *.astro files.
- Updated dependencies [e541538]
  - @olsen-mono/core-utils@0.0.20
  - @olsen-mono/css-foundation@0.0.13

## 0.0.6

### Patch Changes

- ca79482: Implemented debounce function. Redefined Listbox and Combobox as a Web Component. Added a debounced filter function to Listbox. Fixed sticky listbox group. Implemented hasOwn type guard.
- Updated dependencies [ca79482]
  - @olsen-mono/css-foundation@0.0.12
  - @olsen-mono/core-utils@0.0.19

## 0.0.5

### Patch Changes

- 3fd1116: Added liastbox and combobox components
- Updated dependencies [3fd1116]
  - @olsen-mono/css-foundation@0.0.11

## 0.0.4

### Patch Changes

- 3e18bf6: Added range field component. Added async match function.
- Updated dependencies [3e18bf6]
  - @olsen-mono/core-utils@0.0.18

## 0.0.3

### Patch Changes

- d4afbed: Added: assert-valid-slots.ts, checkbox.astro, field-group.astro, field-help.astro, form-elements.astro, form-elements.css, input-field.astro, input-group.astro, radio-button.astro, select-field.astro, text-area.astro.
- Updated dependencies [d4afbed]
  - @olsen-mono/css-foundation@0.0.10

## 0.0.2

### Patch Changes

- 6357e12: Added a basic page layout and a toggle switch component. Addede match function to core-utils package.
- Updated dependencies [6357e12]
  - @olsen-mono/css-foundation@0.0.9
  - @olsen-mono/core-utils@0.0.17

## 0.0.1

### Patch Changes

- d97de26: Astro: Initial setup
