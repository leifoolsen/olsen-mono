// packages/astro-svg/src/svg-sanitizer.ts
import DOMPurify from 'isomorphic-dompurify';

/**
 * DOMPurify-based sanitizer for inline SVG strings.
 *
 * This uses a lightweight in-memory DOM (HappyDOM), so DOMPurify can run in Node,
 * then applies a conservative config suitable for inline icons.
 *
 * @note:
 * - USE_PROFILES.svg enables SVG-safe defaults.
 * - FORBID_TAGS blocks tags that may embed HTML or external documents.
 * - DOMPurify already removes inline event handlers (on*) and javascript: URIs by default,
 *   but we still forbid known dangerous tags explicitly.
 *
 * @param svg The SVG string to sanitize.
 * @returns The sanitized SVG string, or an empty string if sanitization fails.
 */
export const sanitizeSvg = (svg: string): string => {
  if (!svg) return svg;

  const clean = DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true },
    FORBID_TAGS: ['foreignObject', 'iframe', 'object', 'embed'],
    RETURN_TRUSTED_TYPE: false,
  });

  return typeof clean === 'string' ? clean : String(clean);
};

/** Strictly sanitize an attribute value: throw on tag/quote characters. */
export const sanitizeAttributeValue = ([key, value]: [string, unknown]) => {
  if (value == null) return null;

  const result = String(value);

  if (/[&<>"'`]/.test(result) || /<[^>]+>/.test(result) || /&[a-zA-Z0-9#]+;/.test(result)) {
    throw new Error(`The "${key}" attribute value cannot contain HTML tags or quotes.`);
  }

  return `${key}="${result}"`;
};

/** Formats size value. If the Value is a number, it is converted to an em unit. Otherwise, it is returned as is. */
export const formatSize = (val: string | number | undefined | null, fallback: string | number): string | number => {
  if (val === undefined || val === null) return formatSize(fallback, 1);
  return typeof val === 'number' ? `${val}em` : val;
};

/** Formats style value. If the Value is a string, it is returned as is. Otherwise, it is converted to a string. */
export const formatStyle = (style?: string | Record<string, unknown> | null | undefined) =>
  typeof style === 'string'
    ? style
    : Object.entries(style ?? {})
        .map(([key, value]) => `${key}: ${value}; `)
        .join('');
