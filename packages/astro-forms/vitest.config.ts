/// <reference types="vitest" />
import { baseConfig } from '@olsen-mono/tooling/vitest';
import { getViteConfig } from 'astro/config';
import { defineConfig } from 'vitest/config';

const baseTestOptions = baseConfig.test || {};

export default defineConfig(
  getViteConfig({
    test: {
      ...baseTestOptions,
    },
    // biome-ignore lint/suspicious/noExplicitAny: Casts to `any` because `getViteConfig` returns a `UserConfigFn`, whereas Vitest expects a plain object or promise.
  }) as any,
);
