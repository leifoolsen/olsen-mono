import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONOREPO_ROOT = path.resolve(__dirname, '../..');

const packagesPath = path.resolve(MONOREPO_ROOT, 'packages');
const packageDirs = readdirSync(packagesPath);

const packageAliases = packageDirs.reduce<Record<string, string>>((acc, dir) => {
  acc[`@olsen-mono/${dir}`] = path.resolve(packagesPath, `${dir}/src/index.ts`);
  return acc;
}, {});

export const baseConfig = defineConfig({
  test: {
    alias: packageAliases,
    environment: 'happy-dom',
    globals: true,
    setupFiles: [path.resolve(__dirname, './vitest-setup.ts')],
  },
});
