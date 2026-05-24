import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.resolve(__dirname, './__fixtures__');

describe('css-to-dts blackbox-test', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  it('should parse CSS files and generate correct .d.ts type definitions', async () => {
    // 1. Define an input CSS that we know contains comments, imports, classes, and variables
    const mockCss = `
      /* En kommentar som skal ignoreres */
      @import "normalize.css";

      :root {
        --primary-color: #ff0000;
        --spacing-md: 16px;
      }

      .btn-primary {
        color: var(--primary-color);
      }

      &.is-active {
        display: block;
      }
    `;

    // 2. Write the mock CSS file to disk in the test folder
    const cssFilePath = path.join(TEST_DIR, 'styles.css');
    await fs.writeFile(cssFilePath, mockCss, 'utf-8');

    // 3. Run your CLI script synchronously via Node
    // We use the source code directly (or the dist file if you prefer)
    // and pass the test folder as an argument
    const scriptPath = path.resolve(__dirname, '..', './css-to-dts.ts');

    execSync(`node --experimental-strip-types ${scriptPath} "${TEST_DIR}"`, { stdio: 'pipe' });

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
    expect(dtsContent).toContain("export type Css = 'btn-primary' | 'is-active';");
    expect(dtsContent).toContain("export type CssVariables = '--primary-color' | '--spacing-md';");
    expect(dtsContent).toContain('declare const styles: string;');
    expect(dtsContent).toContain('export default styles;');
  });

  it('should delete obsolete .d.ts files if the CSS file is gone', async () => {
    // Create a "deprecated" .d.ts file without a matching .css file
    const orphanedDtsPath = path.join(TEST_DIR, 'old-styles.css.d.ts');
    await fs.writeFile(orphanedDtsPath, 'export type Css = never;', 'utf-8');

    const scriptPath = path.resolve(__dirname, '..', './css-to-dts.ts');

    execSync(`node --experimental-strip-types ${scriptPath} "${TEST_DIR}"`, { stdio: 'pipe' });

    // Check that the file was deleted by the cleanup logic
    const fileStillExists = await fs
      .access(orphanedDtsPath)
      .then(() => true)
      .catch(() => false);
    expect(fileStillExists).toBe(false);
  });
});
