import { baseOptions } from '@olsen-mono/tooling/tsdown';
import { defineConfig } from 'tsdown';

export default defineConfig({
  ...baseOptions,
  deps: {
    alwaysBundle: ['@olsen-mono/core-utils'],
  },
});
