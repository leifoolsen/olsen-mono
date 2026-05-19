import { baseConfig, createImportOrderRule } from '@olsen-mono/tooling/eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(...baseConfig, globalIgnores(['public/**']), {
  name: 'preset/hono',
  files: [['**/*.{ts,tsx}']],
  rules: {
    ...createImportOrderRule([
      {
        pattern: '{hono,hono/**,htmx.org}',
        group: 'external',
        position: 'before',
      },
    ]),
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-misused-promises': 'error',
  },
});
