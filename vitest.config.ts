// vitest.config.ts
import { baseConfig } from '@olsen-mono/tooling/vitest.base';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      projects: ['packages/*', '!packages/css-foundation', '!tools'],
    },
  }),
);
