import { serve } from '@hono/node-server';
import app from './app';

const port = 3000;

// Sjekk om vi kjører i Vite-dev-modus eller ren Node
if (process.env.NODE_ENV === 'production') {
  console.info(`🚀 Serveren suser av gårde på http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}

// VIKTIG: Dette fjerner feilmeldingen din! Vite-dev-server trenger denne:
export default app;
