/// <reference types="vitest" />

import { getViteConfig } from 'astro/config';
import { baseConfig } from './vitest.base.ts';

const baseTestOptions = baseConfig.test || {};

export default getViteConfig({
  test: {
    ...baseTestOptions,
  },
  // biome-ignore lint/suspicious/noExplicitAny: Casts to `any` because `getViteConfig` returns a `UserConfigFn`, whereas Vitest expects a plain object or promise.
} as any);
