import { baseConfig } from '@olsen-mono/tooling/eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([...baseConfig, globalIgnores(['public/*'])]);
