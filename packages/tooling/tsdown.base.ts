import { defineConfig, type UserConfig } from 'tsdown';

export const baseOptions: UserConfig = {
  entry: ['./src/index.ts'],
  format: ['esm'],
  dts: !process.argv.includes('--watch'),
  clean: true,
  sourcemap: true,
  platform: 'node',
  minify: false,
  deps: {
    neverBundle: [/\.css$/, 'node:util'],
  },
};

export default defineConfig(baseOptions);
