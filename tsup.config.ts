import { defineConfig } from 'tsup';
import { baseOptions } from '@olsen-mono/tooling/tsup';

export default defineConfig((options) => ({
  ...baseOptions,
  ...options,
}));
