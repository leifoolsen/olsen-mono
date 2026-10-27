import { defineConfig } from 'vitest/config';
import { sharedConfig } from './tools/tooling/vitest.base.ts';

export default defineConfig({
  test: sharedConfig,
});
