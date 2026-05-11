import { defineConfig } from 'tsup';
import { baseOptions } from './packages/tooling/tsup.base';

export default defineConfig((options) => ({
  ...baseOptions,
  ...options,
}));
