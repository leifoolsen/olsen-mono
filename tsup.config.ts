import { type Options, defineConfig } from 'tsup';

export const baseOptions: Options = {
  bundle: true,
  dts: true,
  entry: ['src/index.ts'],
  external: [/\.css$/],
  format: ['esm'],
  minify: false,
  outDir: 'lib',
  silent: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
};

// To override base options, e.g., minify: minify: tsup --minify
export default defineConfig((options: Options) => {
  return {
    ...baseOptions,
    ...options,
  };
});
