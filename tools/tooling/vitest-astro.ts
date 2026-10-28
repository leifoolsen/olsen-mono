/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';
import { mergeConfig } from 'vitest/config';
import { baseConfig } from './vitest.base.ts';

const config: ReturnType<typeof getViteConfig> = getViteConfig(
  mergeConfig(baseConfig, {
    test: {
      environment: 'happy-dom',
    },
  }),
);

export default config;
