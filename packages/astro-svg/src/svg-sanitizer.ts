// packages/astro-svg/src/svg-sanitizer.ts
import sanitizeHtml from 'sanitize-html';

const SVG_ALLOWED_TAGS = [
  'svg',
  'g',
  'defs',
  'symbol',
  'use',
  'title',
  'desc',
  'path',
  'rect',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'text',
  'tspan',
  'clipPath',
  'mask',
  'pattern',
  'linearGradient',
  'radialGradient',
  'stop',
  'marker',
];

const SVG_ALLOWED_ATTRIBUTES = [
  // Core & layout
  'id',
  'class',
  'style',
  'xmlns',
  'xmlns:xlink',
  'viewBox',
  'preserveAspectRatio',
  'width',
  'height',
  'x',
  'y',
  'dx',
  'dy',
  // Geometry
  'd',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'x1',
  'y1',
  'x2',
  'y2',
  'points',
  'pathLength',
  // Presentation & styling
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-opacity',
  'opacity',
  'color',
  'transform',
  'transform-origin',
  'clip-path',
  'clip-rule',
  'mask',
  'vector-effect',
  // Gradients
  'gradientUnits',
  'gradientTransform',
  'spreadMethod',
  'offset',
  'stop-color',
  'stop-opacity',
  'fx',
  'fy',
  // Text & markers
  'text-anchor',
  'dominant-baseline',
  'font-family',
  'font-size',
  'font-weight',
  'marker-start',
  'marker-mid',
  'marker-end',
  'markerWidth',
  'markerHeight',
  'refX',
  'refY',
  'orient',
  // Accessibility & data attributes
  'role',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'focusable',
  'tabindex',
  'data-*',
];

/**
 * Sanitizer for inline SVG strings.
 *
 * This uses `sanitize-html` to sanitize SVG strings.
 *
 * @note:
 * allowedSchemes: [],  allows same-document #fragment links while blocking all external http://, https://, data:, and JavaScript: URLs
 * - nonTextTags: By default, sanitize-html strips unknown tags like <foreignObject> or <iframe> but leaves their inner
 *   text/content behind. Adding 'foreignObject', 'iframe', 'object', and 'embed' to nonTextTags strips both the tag
 *   and everything inside it—matching DOMPurify's FORBID_TAGS behavior.
 * - Same-document <use href="#icon-id"> fragments: sanitize-html allows relative fragment URLs (#icon-id) on href by
 *   default while blocking JavaScript: and data: schemes via allowedSchemes: ['http', 'https'].
 * - One critical detail when configuring sanitize-html for inline SVGs: set parser.lowerCaseTags: false and
 *   parser.lowerCaseAttributeNames: false, and make sure you allow SVG-specific tags (clipPath, linearGradient,
 *   radialGradient, fe* filters if used) and data-* attributes so icons aren't accidentally stripped or broken.
 *
 * @param svg The SVG string to sanitize.
 * @returns The sanitized SVG string, or an empty string if sanitization fails.
 */
export const sanitizeSvg = (svg: string): string => {
  if (!svg) return svg;

  return sanitizeHtml(svg, {
    allowedTags: SVG_ALLOWED_TAGS,
    allowedAttributes: {
      '*': SVG_ALLOWED_ATTRIBUTES,
      use: ['href', 'xlink:href'],
    },
    allowedSchemes: [], // ['http', 'https'],
    allowProtocolRelative: false,
    allowedSchemesAppliedToAttributes: ['href', 'xlink:href'],
    nonTextTags: ['style', 'script', 'textarea', 'option', 'noscript', 'foreignObject', 'iframe', 'object', 'embed'],
    parser: {
      lowerCaseTags: false,
      lowerCaseAttributeNames: false,
    },
    transformTags: {
      /**
       * The transformTags hook ensures any url(...) value in presentation attributes only references a local #id.
       * By default, sanitize-html only validates URL schemes on href, src, and cite. In SVG, attributes like
       * fill="url(https://evil.com)" or clip-path="url(...)" can also make external requests, whereas safe gradients
       * use local fragments (fill="url(#my-gradient)").
       * @param tagName
       * @param attribs
       */
      '*': (tagName, attribs) => {
        for (const attr of ['fill', 'stroke', 'clip-path', 'mask']) {
          if (
            attribs[attr] &&
            /url\s*\(/i.test(attribs[attr]) &&
            !/^url\(\s*['"]?#[a-zA-Z0-9_-]+['"]?\s*\)$/i.test(attribs[attr].trim())
          ) {
            delete attribs[attr];
          }
        }
        return { tagName, attribs };
      },
    },
  });
};

const isDangerousUrl = (value: unknown) => {
  const normalized = String(value)
    .trim()
    // biome-ignore lint/suspicious/noControlCharactersInRegex: control characters are ok here
    .replace(/\u0000/g, '')
    .toLowerCase();
  return /^javascript\s*:/i.test(normalized) || /^vbscript\s*:/i.test(normalized) || /^data\s*:/i.test(normalized);
};

const isDangerousStyle = (value: string): boolean => {
  /** Normalize whitespace, null bytes, and CSS hex escapes (\6a = 'j', etc.) */
  const normalized = value
    // biome-ignore lint/suspicious/noControlCharactersInRegex: control characters are ok here
    .replace(/[\u0000\s]+/g, '')
    .toLowerCase();

  return (
    normalized.includes('expression(') ||
    normalized.includes('javascript:') ||
    normalized.includes('vbscript:') ||
    /url\(\s*['"]?(?!#)/i.test(value.trim()) // Blocks external/data url(...) while allowing url(#local-id)
  );
};

/**
 * Strictly sanitize an attribute entry: throw on tag/quote characters.
 * Rule for sanitizing attribute values.
 * * escape attribute values when serializing
 * * reject dangerous names/URL schemes
 * * reject event handlers
 * * allow ordinary text and entities as data
 */
export const sanitizeAttribute = ([key, value]: [string, unknown]) => {
  if (value == null) return null;

  if (!/^[a-zA-Z_:][a-zA-Z0-9_.:-]*$/.test(key)) return null;

  const lowerKey = key.toLowerCase();
  if (lowerKey.startsWith('on')) return null;
  if (['href', 'xlink:href', 'src'].includes(lowerKey) && isDangerousUrl(value)) return null;

  const raw = String(value);

  // Reject actual markup or control chars, not escaped entities.
  // biome-ignore lint/suspicious/noControlCharactersInRegex: control characters are ok here
  if (/<\s*\/?[a-zA-Z]/.test(raw) || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(raw)) {
    throw new Error(`The "${key}" attribute value cannot contain HTML tags.`);
  }

  if (lowerKey === 'style' && isDangerousStyle(raw)) return null;

  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;');

  return `${key}="${escaped}"`;
};

/** Formats size value. If the Value is a number, it is converted to an em unit. Otherwise, it is returned as is. */
export const formatSize = (val: string | number | undefined | null, fallback?: string | number): string | number => {
  if (val === undefined || val === null) return formatSize(fallback, 1);
  return typeof val === 'number' ? `${val}em` : val;
};

/** Formats style value. If the Value is a string, it is returned as is. Otherwise, it is converted to a string. */
const CSS_PROP_NAME_RE = /^(--[a-zA-Z0-9_-]+|[a-zA-Z-]+)$/;

export const formatStyle = (style?: string | Record<string, unknown> | null | undefined): string => {
  if (!style) return '';

  if (typeof style === 'string') {
    const trimmed = style.trim();
    if (!trimmed || isDangerousStyle(trimmed)) return '';
    return trimmed;
  }

  return Object.entries(style)
    .filter(([key, value]) => {
      if (value == null || !CSS_PROP_NAME_RE.test(key)) return false;
      const strVal = String(value);
      // Prevent semicolon injection breaking out of a property value
      if (strVal.includes(';') || strVal.includes('{') || strVal.includes('}')) return false;
      return !isDangerousStyle(strVal);
    })
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
};
