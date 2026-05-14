import { defineConfig, globalIgnores } from 'eslint/config';
import { baseConfig } from '@olsen-mono/tooling/eslint';

export default defineConfig([...baseConfig, globalIgnores(['notes/*'])]);
