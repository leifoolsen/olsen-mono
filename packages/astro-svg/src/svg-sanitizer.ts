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

export const isDangerousUrl = (value: unknown) => {
  const normalized = String(value)
    .trim()
    // biome-ignore lint/suspicious/noControlCharactersInRegex: control characters are ok here
    .replace(/\u0000/g, '')
    .toLowerCase();
  return /^javascript\s*:/i.test(normalized) || /^vbscript\s*:/i.test(normalized) || /^data\s*:/i.test(normalized);
};

/**
 * Strictly sanitize an attribute entry: throw on tag/quote characters.
 * Rule for sanitizing attribute values.
 * * escape attribute values when serializing
 * * reject dangerous names/URL schemes
 * * reject event handlers
 * * allow ordinary text and entities as data
 */
export const sanitizeAttributeEntry = ([key, value]: [string, unknown]) => {
  if (value == null) return null;

  // Keep attribute names strict but don't reject valid text values.
  if (!/^[a-zA-Z_:][a-zA-Z0-9_.:-]*$/.test(key)) return null;
  if (/^on/i.test(key)) return null;
  if (['href', 'xlink:href', 'src'].includes(key) && isDangerousUrl(value)) return null;

  const raw = String(value);

  // Reject actual markup or control chars, not escaped entities.
  // biome-ignore lint/suspicious/noControlCharactersInRegex: control characters are ok here
  if (/<\s*\/?[a-zA-Z]/.test(raw) || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(raw)) {
    throw new Error(`The "${key}" attribute value cannot contain HTML tags or quotes.`);
  }

  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;');

  return `${key}="${escaped}"`;
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
