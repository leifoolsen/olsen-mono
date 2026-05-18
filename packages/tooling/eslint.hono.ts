import { defineConfig } from 'eslint/config';
import { baseConfig, createImportOrderRule } from './eslint.base';

export const honoConfig = defineConfig(...baseConfig, {
  name: 'preset/hono',
  files: ['**/backend/**/*.ts'],
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
