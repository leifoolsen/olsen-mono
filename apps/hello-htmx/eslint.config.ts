import { honoConfig } from '@olsen-mono/tooling/eslintHono';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(...honoConfig, globalIgnores(['public/**']));
