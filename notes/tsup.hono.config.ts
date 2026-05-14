import { baseOptions } from '@olsen-mono/tooling/tsup';
import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  ...baseOptions,
  outDir: 'dist',
  jsxFactory: 'jsx',
  jsxFragment: 'Fragment',
  banner: {
    js: `import { jsx, Fragment } from 'hono/jsx';`,
  },
  ...options,
}));
