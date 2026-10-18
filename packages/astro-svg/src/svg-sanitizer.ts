import createDOMPurify from 'dompurify';
import { Window } from 'happy-dom';

/**
 * packages/astro-svg/src/svg-sanitizer.ts
 *
 * DOMPurify-based sanitizer for SVG strings using HappyDOM as the runtime DOM.
 * This parses the SVG using a HappyDOM window and then runs DOMPurify with a
 * conservative whitelist for SVG elements and attributes.
 *
 * Note: You must install the runtime dependency in your project:
 *   pnpm add dompurify happy-dom
 *
 * DOMPurify will strip scripts, event handlers, javascript: URIs, and other
 * dangerous constructs while preserving typical SVG markup.
 */

const happyWindow = new Window();
const DOMPurify = createDOMPurify(happyWindow as unknown as Window & typeof globalThis);

// Conservative whitelist of common SVG tags and attributes used for icons.
const ALLOWED_TAGS = [
  'svg',
  'g',
  'defs',
  'title',
  'desc',
  'use',
  'symbol',
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
  'linearGradient',
  'stop',
  'pattern',
  'filter',
  'image'
];

const ALLOWED_ATTR = [
  'width',
  'height',
  'viewBox',
  'preserveAspectRatio',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'd',
  'x',
  'y',
  'cx',
  'cy',
  'r',
  'x1',
  'y1',
  'x2',
  'y2',
  'points',
  'transform',
  'class',
  'id',
  'role',
  'aria-label',
  'aria-labelledby',
  'vector-effect',
  'xmlns',
  'href',
  'xlink:href',
  'opacity',
  'mask',
  'clip-path'
  // Intentionally omit `style` to avoid inline CSS risks; add if you need it.
];

export const sanitizeSvg = (svg: string): string => {
  if (!svg) return svg;

  // Use DOMPurify with a conservative whitelist for SVG
  const clean = DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true },
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    RETURN_TRUSTED_TYPE: false,
  });

  return String(clean);
};
