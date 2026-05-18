import type { FC, PropsWithChildren } from 'hono/jsx';

type LayoutProps = PropsWithChildren<{
  cssUrl?: string;
}>;

export const Layout: FC<LayoutProps> = ({ children, cssUrl = '/static/css/main.css' }) => {
  return (
    <html lang="no">
      <head>
        <script src="/js/htmx.min.js"></script>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hello HTMX</title>
        <link rel="stylesheet" href={cssUrl} />
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
