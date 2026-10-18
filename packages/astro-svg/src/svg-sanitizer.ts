/**
 * packages/astro-svg/src/svg-sanitizer.ts
 *
 * A small, best-effort sanitizer for inline SVG strings used by SvgIcon.astro.
 * This module exposes a single function, `sanitizeSvg`, which removes common
 * dangerous constructs from a raw SVG string before it is injected into the DOM.
 *
 * NOTE: This is a regex-based sanitizer intended to reduce the most common XSS
 * vectors (script tags, foreignObject, event attributes, javascript: URIs,
 * and embedded objects). It is NOT a substitute for a full XML sanitizer or
 * for only accepting SVGs from trusted sources.
 */

export const sanitizeSvg = (svg: string): string => {
  if (!svg) return svg;

  return svg
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject\b[^>]*>[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\s(on[a-z]+)\s*=\s*(['"])?[\s\S]*?\2/gi, '')
    .replace(/\s(?:href|xlink:href)\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*>[\s\S]*?<\/embed>/gi, '');
};
