import { defineConfig } from 'tsup';
import { baseOptions } from '../../tsup.config';

export default defineConfig((options) => ({
  ...baseOptions,
  noExternal: ['@olsen-mono/core-utils'],
  ...options,
}));
