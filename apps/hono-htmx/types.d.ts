/// <reference types="vite/client" />
import 'hono';

declare module 'hono/jsx' {
  namespace JSX {
    interface HTMLAttributes {
      [key: `hx-${string}`]: string | boolean;
    }
  }
}

declare module '*.css';

declare module './index.css?url' {
  const content: string;
  export default content;
}

declare module '*.css?url' {
  const content: string;
  export default content;
}

// import 'hono';
//
// declare module 'hono/jsx' {
//   interface HTMLAttributes {
//     'hx-get'?: string;
//     'hx-post'?: string;
//     'hx-put'?: string;
//     'hx-delete'?: string;
//     'hx-target'?: string;
//     'hx-swap'?: string;
//     'hx-trigger'?: string;
//     'hx-indicator'?: string;
//     'hx-push-url'?: string | boolean;
//     'hx-confirm'?: string;
//     'hx-vals'?: string;
//   }
// }
