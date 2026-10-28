/// <reference types="vitest" />
import fs, { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import type { InlineConfig } from 'vitest/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONOREPO_ROOT = path.resolve(__dirname, '../..');

const packagesPath = path.resolve(MONOREPO_ROOT, 'packages');
const packageDirs = readdirSync(packagesPath);

const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
const safePackageName = packageJson.name.replace('/', '-');

const packageAliases = packageDirs.reduce<Record<string, string>>((acc, dir) => {
  acc[`@olsen-mono/${dir}`] = path.resolve(packagesPath, `${dir}/src/index.ts`);
  return acc;
}, {});

export const sharedConfig: InlineConfig = {
  alias: packageAliases,
  globals: true,
  reporters: ['default'],
  setupFiles: [path.resolve(__dirname, './vitest-setup.ts')],
  include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  coverage: {
    provider: 'v8',
    reporter: [['json', { file: `${path.basename(process.cwd())}.json` }], 'text', 'html'],
    reportsDirectory: path.resolve(MONOREPO_ROOT, `.coverage/${safePackageName}`),
    clean: true,
    include: ['src/**/*'],
    exclude: ['**/*.d.ts', '**/*.md', '**/*.json', '**/src/index.ts', '**/src/types.ts', '**/*.css', '**/*.svg'],
  },
};

export const baseConfig = defineConfig({
  test: sharedConfig,
});
