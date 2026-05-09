import { baseConfig } from '@olsen-mono/tooling/vitest';
import { mergeConfig, defineConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'try-catch',
    },
  }),
);
