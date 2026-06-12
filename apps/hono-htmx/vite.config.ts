// apps/hono-htmx/vite.config.ts
import devServer from '@hono/vite-dev-server';
import { defineConfig } from 'vite';
import FullReload from 'vite-plugin-full-reload';
import { liveReload } from 'vite-plugin-live-reload';

export default defineConfig(({ command }) => ({
  plugins: [
    devServer({
      entry: 'src/index.tsx',
    }),
    {
      name: 'fast-shutdown',
      configureServer(server) {
        process.on('SIGINT', () => {
          server
            .close()
            .then(() => {
              process.exit(0);
            })
            .catch((error: unknown) => {
              console.error('❌ Error during clean shutdown:', error);
              process.exit(1);
            });
        });
      },
    },
    command === 'serve' ? liveReload(['src/**/*.{ts,tsx}']) : [],
    command === 'serve' ? FullReload(['src/html/**/*.html']) : [],
  ],
  server: {
    watch: {
      ignored: ['!**/src/**/*.html', '!**/public/**/*.html'],
    },
  },
  build:
    command === 'serve'
      ? {}
      : {
          ssr: true,
          target: 'node26',
          outDir: 'dist',
          rollupOptions: {
            input: {
              server: 'src/index.tsx',
              client: 'src/client.ts',
            },
          },
        },
}));
