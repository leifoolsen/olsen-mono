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
      weights: [300, 400, 500, 600, 700, 800, 900],
      cssVariable: '--font-family-heading',
      fallbacks: ['Arial', 'sans-serif'],
      provider: fontProviders.google(),
    },
    {
      name: 'Open Sans',
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      cssVariable: '--font-family-main',
      fallbacks: ['Arial', 'sans-serif'],
      provider: fontProviders.google(),
    },
    {
      name: 'SUSE Mono',
      cssVariable: '--font-family-mono',
      fallbacks: ['monospace', 'Arial', 'sans-serif'],
      provider: fontProviders.google(),
    },
  ],
});
