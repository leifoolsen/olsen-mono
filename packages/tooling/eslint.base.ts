import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/config-helpers';
import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import { flatConfigs as importXConfigs } from 'eslint-plugin-import-x';
import globals from 'globals';
import { configs as tseslintConfigs } from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(__dirname, '../..');
const gitIgnore = path.resolve(monorepoRoot, '.gitignore');

type PathGroup = {
  pattern: string;
  group: 'external' | 'internal' | 'index' | 'sibling' | 'parent' | 'object' | 'unknown';
  position: 'before' | 'after';
};

export const createImportOrderRule = (extraPathGroups: PathGroup[] = []): Linter.RulesRecord => ({
  'import-x/order': [
    'error',
    {
      'newlines-between': 'never',
      alphabetize: { order: 'asc', caseInsensitive: true },
      groups: [
        // 'type', // <- TypeScript type imports
        'builtin', // <- Built-in imports (come from Node.js native) go first
        'external', // <- External imports
        'internal', // <- Absolute imports
        'parent', // <- Relative imports, ../
        'sibling', // <- Relative imports, ./
        'index', // <- index imports
        'object', // <- Any arcane TypeScript imports
        'unknown',
      ],
      distinctGroup: false,
      pathGroups: [
        ...extraPathGroups,
        {
          pattern: '*.css',
          group: 'unknown',
          position: 'after',
          patternOptions: { matchBase: true },
        },
      ],
      pathGroupsExcludedImportTypes: [],
    },
  ],
});

export const baseConfig = defineConfig(
  includeIgnoreFile(gitIgnore, 'Imported .gitignore patterns'),
  {
    ignores: ['**/lib', '**/dist', '.prettierrc.ts', 'turbo.json'],
  },
  {
    ignores: ['**/lib'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: monorepoRoot,
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslintConfigs.strictTypeChecked,
  importXConfigs.recommended,
  importXConfigs.typescript,
  {
    name: 'base/custom-rules',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      ...createImportOrderRule(),
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
        },
      ],
      // import-x/no-cycle; "This rule is comparatively computationally expensive. If you are pressed for lint time,
      // or don't think you have an issue with dependency cycles, you may not want this rule enabled."
      // Tips: Use "maxDepth: 1" when overflowed with cyclic dependencies' error.
      'import-x/no-cycle': ['error', { maxDepth: Infinity }],
      'import-x/no-self-import': 'error',
      'no-console': ['warn', { allow: ['info', 'error', 'warn'] }],
      'no-undef': 'off',
      'no-warning-comments': 'warn',
    },
  },
  prettierConfig,
);
