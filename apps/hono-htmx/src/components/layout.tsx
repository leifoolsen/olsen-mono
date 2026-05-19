import type { FC, PropsWithChildren } from 'hono/jsx';

const isProd = process.env.NODE_ENV === 'production';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="no">
      <head>
        <script src="/js/htmx.min.js"></script>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hello HTMX</title>
        {isProd ? (
          <link rel="stylesheet" href="/assets/client.css" />
        ) : (
          <>
            {/* 1. Fortell nettleseren at den skal koble seg til Vites dev-motor */}
            <script type="module" src="/@vite/client"></script>
            {/* 2. Last klient-ts som en modul. Vite transformerer CSS-importen inni den automatisk! */}
            <script type="module" src="/src/client.ts"></script>
          </>
        )}
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Hono + HTMX Utforskning</h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
};
