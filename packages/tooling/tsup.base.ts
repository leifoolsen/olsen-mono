import { type Options, defineConfig } from 'tsup';

export const baseOptions: Options = {
  bundle: true,
  clean: true,
  dts: true,
  entry: ['./src/index.ts'],
  external: [/\.css$/, 'node:util'],
  format: ['esm'],
  minify: false,
  outDir: 'lib',
  silent: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  target: 'esnext', // 'node26' for Node.js 26+
  treeshake: true,
};

// To override base options, e.g., minify: minify: tsup --minify
export default defineConfig((options: Options) => {
  return {
    ...baseOptions,
    ...options,
  };
});
