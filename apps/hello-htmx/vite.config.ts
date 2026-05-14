import devServer from '@hono/vite-dev-server';
import { defineConfig } from 'vite';
import { liveReload } from 'vite-plugin-live-reload';

export default defineConfig(({ command }) => ({
  plugins: [
    devServer({
      entry: 'src/app.tsx',
    }),
    command === 'serve' ? liveReload(['src/**/*.{ts,tsx}']) : [],
  ],
  build: {
    ssr: true,
    target: 'node26',
    outDir: 'dist',
    rollupOptions: {
      input: 'src/index.tsx',
    },
  },
}));
