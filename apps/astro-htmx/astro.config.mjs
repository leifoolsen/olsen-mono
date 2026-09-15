// @ts-check
// FIX: Import from 'node:fs', not 'node:fs/promises'
import { readFileSync } from 'node:fs';
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), { encoding: 'utf8' }));

const internalPackages = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((name) =>
  name.startsWith('@olsen-mono/'),
);

// See: https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),

  vite: {
    optimizeDeps: {
      exclude: internalPackages,
    },
    ssr: {
      noExternal: internalPackages,
    },
  },
});
