// app.tsx
import path from 'node:path';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { html, raw } from 'hono/html';
import { serveStatic } from '@hono/node-server/serve-static';
import { Button } from './components/button';
import { Layout } from './components/layout';
import colorSwatch from './html/color-swatch.html?raw';
import html5TestData from './html/html5-test-page.html?raw';
import { getFormattedTime, getAppUptime } from './utils';

type AppTheme = 'light' | 'dark' | 'auto';

const app = new Hono();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const staticRoot = process.env.NODE_ENV === 'production' ? path.join(__dirname, 'public') : './';

// Gjør serving av public sikrere i dev-modus
// app.use('/*', serveStatic({ root: process.env.NODE_ENV === 'production' ? './public' : './' }));
app.use('/*', serveStatic({ root: staticRoot }));

// 1. ENDEPUNKT FOR TEMA-BYTTE
app.post('/api/toggle-theme', (c) => {
  const currentTheme = (getCookie(c, 'theme') || 'auto') as AppTheme;
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  setCookie(c, 'theme', nextTheme, { maxAge: 31536000, path: '/' });

  return c.html(
    <button hx-post="/api/toggle-theme" hx-swap="outerHTML" data-variant="danger" hx-on:click="toggleAppTheme()">
      Bytt til {nextTheme === 'dark' ? 'lyst' : 'mørkt'} tema
    </button>,
  );
});

// 2. HOVEDSIDE
app.get('/', (c) => {
  const theme = getCookie(c, 'theme') || 'auto';
  return c.html(
    <Layout theme={theme}>
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

app.get('/html5-test-page', (c) => {
  const theme = getCookie(c, 'theme') || 'auto';

  return c.html(
    <Layout theme={theme}>
      <div class="box" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2>HTML5 Typesetting Testside</h2>
          <p>Lastet dynamisk fra en ren .html-fil via Vite</p>
        </div>
        <button hx-post="/api/toggle-theme" hx-swap="outerHTML" data-variant="danger" hx-on:click="toggleAppTheme()">
          Bytt til {theme === 'dark' ? 'lyst' : 'mørkt'} tema
        </button>
      </div>
      <section class="box">{html`${raw(html5TestData)}`}</section>
    </Layout>,
  );
});

app.get('/color-swatch', (c) => {
  const theme = getCookie(c, 'theme') || 'auto';

  return c.html(
    <Layout theme={theme}>
      <div class="box" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2>Colors</h2>
        </div>
        <button hx-post="/api/toggle-theme" hx-swap="outerHTML" data-variant="success" hx-on:click="toggleAppTheme()">
          Bytt til {theme === 'dark' ? 'lyst' : 'mørkt'} tema
        </button>
      </div>
      <section class="box">{html`${raw(colorSwatch)}`}</section>
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
        ⏱️ Serveren har kjørt i totalt:{' '}
        <span style="color: var(--color-success-base); font-weight: bold; margin-left: 0.5rem;">{oppetid}</span>
      </p>
    </div>,
  );
});

export default app;
