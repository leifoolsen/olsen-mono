// app.tsx
import path from 'node:path';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { html, raw } from 'hono/html';
import { Button } from './components/button';
import { Layout } from './components/layout';
import designSystemPage from './html/design-system.html?raw';
import html5TestPage from './html/html5-test-page.html?raw';
import { browserGuard } from './middleware/browser-guard.ts';
import { getAppUptime, getFormattedTime } from './utils';

type AppTheme = 'light' | 'dark' | 'auto';
type AppDensity = 'condensed' | 'normal';

const app = new Hono();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const staticRoot = process.env.NODE_ENV === 'production' ? path.join(__dirname, 'public') : './';

app.use('*', browserGuard);

app.use('/*', serveStatic({ root: staticRoot }));

// ENDEPUNKT FOR TEMA-BYTTE
app.post('/api/toggle-theme', (c) => {
  const currentTheme = (getCookie(c, 'theme') || 'auto') as AppTheme;
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  setCookie(c, 'theme', nextTheme, { maxAge: 31536000, path: '/' });

  return c.html(
    <button
      type="button"
      hx-post="/api/toggle-theme"
      hx-swap="outerHTML"
      data-variant="danger"
      hx-on:click="toggleAppTheme()"
    >
      Change to {nextTheme === 'dark' ? 'light' : 'dark'} theme
    </button>,
  );
});

app.post('/api/toggle-density', (c) => {
  const currentTheme = (getCookie(c, 'density') || 'normal') as AppDensity;
  const nextTheme = currentTheme === 'normal' ? 'condensed' : 'normal';

  setCookie(c, 'density', nextTheme, { maxAge: 31536000, path: '/' });

  return c.html(
    <button
      type="button"
      hx-post="/api/toggle-density"
      hx-swap="outerHTML"
      data-variant="primary"
      hx-on:click="toggleAppDensity()"
    >
      Toggle font size
    </button>,
  );
});

// HOVEDSIDE
app.get('/', (c) => {
  const theme = getCookie(c, 'theme') || 'auto';
  const density = getCookie(c, 'density') || 'normal';

  return c.html(
    <Layout theme={theme} density={density}>
      <div class="box" style="display: flex; gap: 1rem; align-items: center;">
        <button
          type="button"
          hx-post="/api/toggle-density"
          hx-swap="outerHTML"
          data-variant="secondary"
          hx-on:click="toggleAppDensity()"
        >
          Toggle font size
        </button>

        <Button />

        <div id="fragment-target">Waiting for server data...</div>
      </div>
    </Layout>,
  );
});

app.get('/html5-test-page', (c) => {
  const theme = getCookie(c, 'theme') || 'auto';

  return c.html(
    <Layout theme={theme}>
      <div class="box" style="display: flex; justify-content: space-between; align-items: baseline;">
        <h2>HTML5 Test Page</h2>
        <button
          type="button"
          hx-post="/api/toggle-theme"
          hx-swap="outerHTML"
          data-variant="danger"
          hx-on:click="toggleAppTheme()"
        >
          Change to {theme === 'dark' ? 'light' : 'dark'} thene
        </button>
      </div>
      <section class="box">{html`${raw(html5TestPage)}`}</section>
    </Layout>,
  );
});

app.get('/design-system', (c) => {
  const theme = getCookie(c, 'theme') || 'auto';
  const density = getCookie(c, 'density') || 'normal';

  return c.html(
    <Layout theme={theme} density={density}>
      <div class="box" style="display: flex; justify-content: space-between; align-items: center;">
        <h2>Fluid, Data Driven Design</h2>
        <button
          type="button"
          hx-post="/api/toggle-theme"
          hx-swap="outerHTML"
          data-variant="success"
          hx-on:click="toggleAppTheme()"
        >
          Change to {theme === 'dark' ? 'light' : 'dark'} theme
        </button>
      </div>
      <section class="box">{html`${raw(designSystemPage)}`}</section>
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
        ✅ Time is now <strong>{tid}</strong>.
      </p>
      <p>
        ⏱️ Server Up Time:{' '}
        <span style="color: var(--color-success-base); font-weight: bold; margin-left: 0.5rem;">{oppetid}</span>
      </p>
    </div>,
  );
});

export default app;
