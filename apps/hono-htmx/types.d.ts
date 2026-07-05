// apps/hono-htmx/types.d.ts
import 'hono/jsx';

declare module 'hono/jsx' {
  namespace JSX {
    interface HTMLAttributes {
      /* ==========================================================================
         CUSTOM ATTRIBUTES
         ========================================================================== */
      'data-variant'?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'danger' | 'success' | 'warning' | 'info' | 'surface' | 'surface-1' | 'surface-2' | (string & {});
      'data-state'?: 'idle' | 'loading' | 'success' | 'error' | (string & {});
      'data-theme'?: 'light' | 'dark' | 'auto' | (string & {});
      'data-density'?: 'condensed' | 'normal' | (string & {});
      'data-text'?: 'brand' | 'normal' | 'subtle' | 'muted' | (string & {});

      /* ==========================================================================
         2. HTMX ATTRIBUTES
         ========================================================================== */
      'hx-get'?: string;
      'hx-post'?: string;
      'hx-put'?: string;
      'hx-delete'?: string;
      'hx-patch'?: string;
      'hx-target'?: string;
      'hx-swap'?: 'innerHTML' | 'outerHTML' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' | 'delete' | 'none' | (string & {});
      'hx-boost'?: 'true' | 'false' | (string & {});
      'hx-trigger'?: string;
      'hx-indicator'?: string;
      'hx-push-url'?: string | boolean;
      'hx-include'?: string;
      'hx-headers'?: string;
      'hx-vals'?: string;
      'hx-confirm'?: string;
      'hx-disable'?: boolean;
      'hx-disabled-elt'?: string;
      'hx-ext'?: string;

      [key: `hx-on:${string}`]: string;
      [key: `hx-on-${string}`]: string;

      /* ==========================================================================
         HTMX FALLBACK
         ========================================================================== */
      [key: `hx-${string}`]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }
}

declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module '*.css' {
  export type Css = string;
  export type CssVariables = `--${string}`;
  const styles: string;
  export default styles;
}
