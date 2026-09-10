import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.resolve(__dirname, './__fixtures__');

describe('css-to-dts', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  it('should parse CSS files and generate correct .d.ts type definitions', async () => {
    // 1. Define an input CSS that we know contains comments, imports, classes, and variables
    const mockCss = `
      /* A comment - should be ignored */
      @import "normalize.css";

      :root {
        --primary-color: #ff0000; /* A comment - should be ignored */
        --spacing-md: 16px;
      }

      .btn-primary[data-color] {
        color: var(--primary-color);
        mask-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox....");

        /* A comment - should be ignored */
        &.is-active {
          display: block;
        }
      }

      .aCamelCasedClass {
        display: inline-block;
      }
    `;

    // 2. Write the mock CSS file to disk in the test folder
    const cssFilePath = path.join(TEST_DIR, 'styles.css');
    await fs.writeFile(cssFilePath, mockCss, 'utf-8');

    // 3. Run CLI script synchronously via Node
    // Use the source code directly and pass the test folder as an argument
    const scriptPath = path.resolve(__dirname, '..', './css-to-dts.ts');

    execSync(`node --experimental-strip-types ${scriptPath} "${TEST_DIR}"`, {
      stdio: 'pipe',
    });

    // 4. Check if the corresponding .d.ts file was created
    const dtsFilePath = `${cssFilePath}.d.ts`;
    const dtsExists = await fs
      .access(dtsFilePath)
      .then(() => true)
      .catch(() => false);
    expect(dtsExists).toBe(true);

    // 5. Assert (Blackbox) against the expected output string
    const dtsContent = await fs.readFile(dtsFilePath, 'utf-8');

    // Expect classes and variables to be sorted and packaged in a union type
    expect(dtsContent).toContain(
      'export type Css = \n' + "  | 'aCamelCasedClass'\n" + "  | 'btn-primary'\n" + "  | 'is-active';",
    );
    expect(dtsContent).toContain('export type CssVariables = \n' + "  | '--primary-color'\n" + "  | '--spacing-md';");
    expect(dtsContent).toContain('declare const styles: Record<Css, string>;');
    expect(dtsContent).toContain('export default styles;');
    expect(dtsContent).toContain(
      'export type DataColor = string | boolean | undefined;\n' +
        'export type CssDataAttributes = {\n' +
        "  'data-color': DataColor;\n" +
        '};',
    );
  });

  it('should delete obsolete .d.ts files if the CSS file is gone', async () => {
    // Create a "deprecated" .d.ts file without a matching .css file
    const orphanedDtsPath = path.join(TEST_DIR, 'old-styles.css.d.ts');
    await fs.writeFile(orphanedDtsPath, 'export type Css = never;', 'utf-8');

    const scriptPath = path.resolve(__dirname, '..', './css-to-dts.ts');

    execSync(`node --experimental-strip-types ${scriptPath} "${TEST_DIR}"`, {
      stdio: 'pipe',
    });

    // Check that the file was deleted by the cleanup logic
    const fileStillExists = await fs
      .access(orphanedDtsPath)
      .then(() => true)
      .catch(() => false);
    expect(fileStillExists).toBe(false);
  });
});
