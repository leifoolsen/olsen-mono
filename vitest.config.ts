import { mergeConfig, defineConfig } from 'vitest/config';
import { baseConfig } from '@olsen-mono/tooling/vitest';

export default mergeConfig(baseConfig, defineConfig({}));
