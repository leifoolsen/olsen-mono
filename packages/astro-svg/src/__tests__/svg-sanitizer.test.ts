// packages/astro-svg/src/__tests__/svg-sanitizer.test.ts
import { describe, expect, it } from 'vitest';
import { sanitizeSvg } from '../svg-sanitizer';

describe('sanitizeSvg', () => {
  it('removes <script> blocks', () => {
    const raw = '<svg><script>alert("x")</script><g></g></svg>';
    const out = sanitizeSvg(raw);
    expect(out).not.toContain('<script>');
    expect(out).toContain('<g></g>');
  });

  it('removes <foreignObject> blocks', () => {
    const raw = '<svg><foreignObject><div><img src=x onerror=alert(1) /></div></foreignObject><path /></svg>';
    const out = sanitizeSvg(raw);
    expect(out).not.toContain('<foreignObject');
    expect(out).toContain('<path');
  });

  it('removes inline on* event handler attributes', () => {
    const raw = '<svg><g onclick="alert(1)" data-test="keep">X</g></svg>';
    const out = sanitizeSvg(raw);
    expect(out).not.toContain(/onclick\s*=/i);
    // keep other attributes
    expect(out).toContain('data-test="keep"');
  });

  it('removes javascript: URIs in href and xlink:href', () => {
    const raw = '<svg><a href="javascript:alert(1)">bad</a><use xlink:href="javascript:alert(2)"></use><g/></svg>';
    const out = sanitizeSvg(raw);
    expect(out).not.toMatch(/href\s*=\s*['"]\s*javascript:/i);
    expect(out).not.toMatch(/xlink:href\s*=\s*['"]\s*javascript:/i);
    expect(out).toContain('<g');
  });

  it('removes <iframe>, <object> and <embed> blocks', () => {
    const raw = '<svg><iframe src="evil"></iframe><object data="evil"></object><embed src="evil" /></svg>';
    const out = sanitizeSvg(raw);
    expect(out).not.toContain('<iframe');
    expect(out).not.toContain('<object');
    expect(out).not.toContain('<embed');
  });

  it('does not remove safe SVG content', () => {
    const raw = '<svg viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="currentColor"/></svg>';
    const out = sanitizeSvg(raw);
    expect(out).toContain('<rect');
    expect(out).toContain('viewBox="0 0 24 24"');
  });

  it('handles empty / falsy input gracefully', () => {
    expect(sanitizeSvg('')).toBe('');
    // biome-ignore lint/suspicious/noExplicitAny: any is acceptable in testing
    expect(sanitizeSvg(null as any)).toBe(null as any);
  });

  it('removes event handlers regardless of quote style and spacing', () => {
    const raw = "<svg><g ONCLICK = 'alert(1)' other='ok'>X</g></svg>";
    const out = sanitizeSvg(raw);
    expect(/onclick/i.test(out)).toBe(false);
    expect(out).toContain("other='ok'");
  });

  it('removes event handlers embedded inside other attributes', () => {
    const raw = '<svg><g data-foo="bar" onmouseover=alert(1)>X</g></svg>';
    const out = sanitizeSvg(raw);
    expect(out).not.toContain(/onmouseover\s*=/i);
    expect(out).toContain('data-foo="bar"');
  });
});
