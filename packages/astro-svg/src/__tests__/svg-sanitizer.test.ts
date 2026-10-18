// packages/astro-svg/src/__tests__/svg-sanitizer.test.ts
import { describe, expect, it } from 'vitest';
import { sanitizeSvg } from '../svg-sanitizer';

describe('sanitizeSvg (DOMPurify + HappyDOM)', () => {
  it('removes <script> blocks (case-insensitive)', () => {
    const raw = '<svg><SCRIPT>alert(1)</SCRIPT><path d="M0 0" /></svg>';
    const out = sanitizeSvg(raw);
    expect(out).not.toMatch(/<script\b/i);
    expect(out).toMatch(/<path\b/i);
  });

  it('removes <foreignObject> blocks', () => {
    const raw = '<svg><foreignObject><div>evil</div></foreignObject><rect /></svg>';
    const out = sanitizeSvg(raw);
    expect(out).not.toMatch(/<foreignObject\b/i);
    expect(out).toMatch(/<rect\b/i);
  });

  it('removes event handler attributes (onclick, onmouseover) in any case and spacing', () => {
    const raw = "<svg><g onclick=\"alert(1)\" ONMOUSEOVER='alert(2)'><path d='M0 0' /></g></svg>";
    const out = sanitizeSvg(raw);
    expect(out).not.toMatch(/onclick\s*=/i);
    expect(out).not.toMatch(/onmouseover\s*=/i);
  });

  it('removes javascript: URIs in href, xlink:href and src', () => {
    const raw = '<svg><a href="javascript:alert(1)">x</a><use xlink:href="javascript:alert(2)"></use><image src="javascript:evil"></image></svg>';
    const out = sanitizeSvg(raw);
    expect(out).not.toMatch(/javascript:/i);
    expect(out).toMatch(/<svg\b/i);
  });

  it('removes iframe, object and embed (paired and self-closing/bare) tags', () => {
    const variants = [
      '<svg><iframe src="evil"></iframe></svg>',
      '<svg><object data="evil"></object></svg>',
      '<svg><embed src="evil" /></svg>',
      '<svg><embed src="evil"></embed></svg>',
      '<svg><iframe src="evil" /></svg>',
      '<svg><object data="evil"></svg>'
    ];

    for (const raw of variants) {
      const out = sanitizeSvg(raw);
      expect(out).not.toMatch(/<iframe\b/i);
      expect(out).not.toMatch(/<object\b/i);
      expect(out).not.toMatch(/<embed\b/i);
    }
  });

  it('removes style attributes when not allowed and strips dangerous CSS', () => {
    const raw = '<svg><rect style="background:url(javascript:alert(1));" fill="red" /></svg>';
    const out = sanitizeSvg(raw);
    expect(out).not.toMatch(/style\s*=/i);
    expect(out).toMatch(/fill\s*=\s*"?red"?/i);
  });

  it('preserves allowed SVG elements and attributes and keeps aria-label with quotes', () => {
    const raw = '<svg viewBox="0 0 24 24"><path d="M0 0" aria-label=\'He said "hi"\' /></svg>';
    const out = sanitizeSvg(raw);
    expect(out).toMatch(/<path\b/i);
    expect(out).toMatch(/aria-label\s*=\s*["'\u00A0\w\W]*He said/i);
  });

  it('returns empty/falsy input unchanged', () => {
    expect(sanitizeSvg('')).toBe('');
    // If your function typing disallows null, remove the next assertion.
    // @ts-expect-error testing null handling
    expect(sanitizeSvg(null as any)).toBe(null as any);
  });
});
