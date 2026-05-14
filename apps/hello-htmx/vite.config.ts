import devServer from '@hono/vite-dev-server';
import { defineConfig } from 'vite';
import { liveReload } from 'vite-plugin-live-reload';

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/app.tsx',
    }),
    liveReload(['src/**/*.{ts,tsx}']),
  ],
});
