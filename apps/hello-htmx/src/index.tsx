import { serve } from '@hono/node-server';
import app from './app';

const port = 3000;
console.info(`🚀 Serveren suser av gårde på http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
