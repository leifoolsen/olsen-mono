import { mergeConfig, defineConfig } from 'vitest/config';
import { baseConfig } from './packages/tooling/vitest.base';

export default mergeConfig(baseConfig, defineConfig({}));
