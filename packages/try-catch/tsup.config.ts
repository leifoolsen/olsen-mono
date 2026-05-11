import { baseOptions } from '@olsen-mono/tooling/tsup';
import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  ...baseOptions,
  noExternal: ['@olsen-mono/core-utils'],
  ...options,
}));
