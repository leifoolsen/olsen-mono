import { Hono } from 'hono';
import { Layout } from './components/layout';
import { getFormattedTime, getAppUptime } from './utils';

const app = new Hono();

// Hovedsiden
app.get('/', (c) => {
  return c.html(
    <Layout>
      <div class="box">
        <p>Dette innholdet er statisk ved første last.</p>

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
