// src/app.tsx
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { Button } from './components/button';
import { Layout } from './components/layout';
import { getFormattedTime, getAppUptime } from './utils';

const app = new Hono();

// Gjør serving av public sikrere i dev-modus
app.use('/*', serveStatic({ root: process.env.NODE_ENV === 'production' ? './public' : './' }));

// Hovedsiden
app.get('/', (c) => {
  return c.html(
    <Layout>
      <div class="box">
        <p>Dette innholdet er statisk ved første last.</p>

        <Button />

        <div id="fragment-target" class="box">
          Venter på data...
        </div>
      </div>
    </Layout>,
  );
});

// En rute som bare returnerer et fragment
app.get('/api/fragment', (c) => {
  const tid = getFormattedTime();
  const oppetid = getAppUptime();

  return c.html(
    <div>
      <p>
        ✅ Klokken er nå <strong>{tid}</strong>.
      </p>
      <p>
        ⏱️ Serveren har kjørt i totalt:
        <span style="color: #28a745; font-weight: bold; margin-left: 0.5rem;">{oppetid}</span>
      </p>
    </div>,
  );
});

export default app;
