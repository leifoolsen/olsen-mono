// @ts-check
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

// See: https://astro.build/config

/** @type {import('astro/config').AstroUserConfig} */
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});
