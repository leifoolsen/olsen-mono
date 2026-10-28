import { getViteConfig } from 'astro/config';
import { configDefaults, defineConfig, defineProject } from 'vitest/config';
import { baseConfig, sharedConfig } from './vitest.base.ts';

type AstroAppConfigOptions = {
  nodeExcludePath?: string;
  logConfig?: boolean;
};

export function createVitesApptConfig(options: AstroAppConfigOptions = {}) {
  const apiExclude = options.nodeExcludePath ? [options.nodeExcludePath] : [];

  return defineConfig({
    test: {
      projects: [
        defineProject(
          getViteConfig({
            ...baseConfig,
            test: {
              ...sharedConfig,
              name: 'astro',
              environment: 'happy-dom',
              exclude: [...configDefaults.exclude, ...(sharedConfig.exclude ?? []), ...apiExclude],
            },
          }),
        ),
        defineProject({
          ...baseConfig,
          test: {
            ...baseConfig.test,
            name: 'node',
            environment: 'node',
            include: options.nodeExcludePath
              ? [`${options.nodeExcludePath.replace('/**', '')}/**/*.test.ts`]
              : ['src/**/*.test.ts'],
          },
        }),
      ],
      coverage: {
        reportsDirectory: './.coverage',
        clean: true,
      },
    },
    // Use this to debug/trace final vitest config
    plugins: options.logConfig
      ? [
          {
            name: 'log-config',
            configResolved(config) {
              console.dir(config.test, { depth: null });
            },
          },
        ]
      : [],
  });
}
