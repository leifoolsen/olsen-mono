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
    // Remove scripts
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    // Remove foreignObject blocks (they can contain HTML)
    .replace(/<foreignObject\b[^>]*>[\s\S]*?<\/foreignObject>/gi, '')
    // Remove event handler attributes like onclick="..." or onmouseover='...'
    .replace(/\s(on[a-z]+)\s*=\s*(['"])?[\s\S]*?\2/gi, '')
    // Remove javascript: URIs in href or xlink:href attributes
    .replace(/\s(?:href|xlink:href)\s*=\s*(['"])\s*javascript:[^'\"]*\1/gi, '')
    // Remove embedded objects that can lead to remote content execution
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*>[\s\S]*?<\/embed>/gi, '');
};
