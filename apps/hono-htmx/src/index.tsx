// index.tsx
import { serve } from '@hono/node-server';
import app from './app';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

if (process.env.NODE_ENV === 'production') {
  console.info(`🚀 Serveren suser av gårde på http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}

export default app;
