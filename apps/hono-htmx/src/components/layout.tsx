// Layout.tsx
import type { FC, PropsWithChildren } from 'hono/jsx';

type LayoutProps = PropsWithChildren & {
  theme?: string;
  density?: string;
};

const isProd = process.env.NODE_ENV === 'production';

export const Layout: FC<LayoutProps> = ({ children, theme = 'auto', density = 'normal' }) => {
  return (
    <html lang="no" data-theme={theme} data-density={density}>
      <head>
        <script src="/js/htmx.min.js"></script>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hono + HTMX</title>

        {isProd ? (
          <>
            <link rel="stylesheet" href="/style.css" />
            <script type="module" src="/client.mjs"></script>
          </>
        ) : (
          <>
            <script type="module" src="/@vite/client"></script>
            <link rel="stylesheet" href="/src/style.css" />
            <script type="module" src="/src/client.ts"></script>
          </>
        )}
      </head>
      <body>
        <div class="container">
          <header>
            <nav hx-boost="true" hx-target="body" style="display: flex; gap: 1rem; margin-block-end: var(--size-4);">
              <a href="/">Home</a>
              <a href="/html5-test-page">HTML5 Test Page</a>
              <a href="/design-system">Fluid Design</a>
            </nav>
            <h1>Hono + HTMX</h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
};
