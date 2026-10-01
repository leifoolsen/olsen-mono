// @ts-check
import node from '@astrojs/node';
import { defineConfig, fontProviders } from 'astro/config';

// See: https://astro.build/config

/** @type {import('astro/config').AstroUserConfig} */
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  fonts: [
    {
      name: 'Titillium Web',
      cssVariable: '--titillium',
      provider: fontProviders.google(),
    },
    {
      name: 'Open Sans',
      cssVariable: '--open-sans',
      provider: fontProviders.google(),
    },
    {
      name: 'Inconsolata',
      cssVariable: '--inconsolata',
      provider: fontProviders.google(),
    },
  ],
});
