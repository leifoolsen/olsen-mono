import { baseOptions } from '@olsen-mono/tooling/tsdown';
import { defineConfig } from 'tsdown';

export default defineConfig({
  ...baseOptions,
  entry: ['./css-to-dts.ts'],
});
