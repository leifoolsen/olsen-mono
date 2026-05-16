import { type Options, defineConfig } from 'tsup';

export const baseOptions: Options = {
  bundle: true,
  dts: true,
  entry: ['./src/index.ts'],
  external: [/\.css$/, 'node:util'],
  format: ['esm'],
  minify: false,
  outDir: 'lib',
  silent: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  target: 'node26',
  treeshake: true,
};

// To override base options, e.g., minify: minify: tsup --minify
export default defineConfig((options: Options) => {
  return {
    ...baseOptions,
    ...options,
  };
});
