// apps/hello-htmx/src/index.tsx
import path from 'node:path';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { Layout } from './components/layout';

const app = new Hono();

// Servér HTMX fra node_modules
// app.get(
//   '/static/htmx.js',
//   serveStatic({
//     path: './node_modules/htmx.org/dist/htmx.min.js',
//   }),
// );

const htmxPath = path.resolve('node_modules/htmx.org/dist/htmx.min.js');

app.get('/static/htmx.js', serveStatic({ path: htmxPath }));

// Hovedsiden
app.get('/', (c) => {
  return c.html(
    <Layout>
      <div class="box">
        <p>Dette innholdet er statisk ved første last.</p>

        {/* HTMX MAGI:
            Ved klikk -> Send GET til /api/fragment
            Bytt ut innholdet i #fragment-target
        */}
        <button hx-get="/api/fragment" hx-target="#fragment-target" hx-swap="innerHTML">
          Hent magisk innhold
        </button>

        <div id="fragment-target" class="box">
          Venter på data...
        </div>
      </div>
    </Layout>,
  );
});

// En rute som bare returnerer et fragment (ingen Layout her!)
app.get('/api/fragment', (c) => {
  const tid = new Date().toLocaleTimeString();
  return c.html(
    <div>
      <p>
        ✅ Dette kom fra serveren klokken <strong>{tid}</strong>!
      </p>
      <p>Legg merke til at URL-en i nettleseren ikke endret seg.</p>
    </div>,
  );
});

const port = 3000;
console.log(`🚀 Serveren suser av gårde på http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
