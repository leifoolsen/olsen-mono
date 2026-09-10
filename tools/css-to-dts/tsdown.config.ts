import { baseOptions } from '@olsen-mono/tooling/tsdown';
import { defineConfig } from 'tsdown';

export default defineConfig({
  ...baseOptions,
  entry: ['./src/css-to-dts.ts'],
});
