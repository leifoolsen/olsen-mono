import { html } from 'hono/html';
import type { FC } from 'hono/jsx';

export const Layout: FC = (props) => {
  return html`
    <!DOCTYPE html>
    <html lang="no">
      <head>
        <script src="/js/htmx.min.js"></script>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hello HTMX</title>
        <style>
          body {
            font-family: sans-serif;
            padding: 2rem;
            line-height: 1.6;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          .box {
            border: 1px solid #ccc;
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 4px;
          }
          button {
            padding: 0.5rem 1rem;
            cursor: pointer;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Hono + HTMX Utforskning</h1>
          </header>
          <main>${props.children}</main>
        </div>
      </body>
    </html>
  `;
};
