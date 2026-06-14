import { baseOptions } from '@olsen-mono/tooling/tsdown';
import { defineConfig } from 'tsdown';

export default defineConfig({
  ...baseOptions,
  entry: ['src/client.ts', 'src/style.css'],
  outDir: 'dist/public',
  clean: false,
  sourcemap: false,
  deps: {
    neverBundle: ['node:util'],
  },
});
