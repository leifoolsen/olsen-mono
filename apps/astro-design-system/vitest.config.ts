import { createVitestAstroAppConfig } from '@olsen-mono/tooling/vitest-astro-app';

export default createVitestAstroAppConfig({
  nodeExcludePath: 'src/api/**',
});
