// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { formatSize, formatStyle, sanitizeAttribute, sanitizeSvg } from '../svg-sanitizer';

describe('svg-sanitizer', () => {
  describe('sanitizeSvg', () => {
    it('removes <script> blocks', () => {
      const raw =
        '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
        '<script>alert(1)</script>' +
        '<!-- Grouping two circles and applying shared styles and a translation -->' +
        '<g fill="white" stroke="green" stroke-width="3" transform="translate(10, 10)">' +
        '<circle cx="20" cy="20" r="15" />' +
        '<circle cx="60" cy="20" r="15" />' +
        '</g>' +
        '</svg>';

      const out = sanitizeSvg(raw);
      expect(out).not.toContain('<script');
      expect(out).toContain(out.match(/<g(?:\s[^>]*)?>([\s\S]*?)<\/g>/g)?.join(''));
    });

    it('removes <foreignObject> blocks', () => {
      const raw = '<svg><foreignObject><div><img src=x onerror=alert(1) /></div></foreignObject><path /></svg>';
      const out = sanitizeSvg(raw);
      expect(out).not.toContain('<foreignObject');
      expect(out).toContain('<path');
    });

    it('removes <!-- Comments --> blocks', () => {
      const raw = '<svg><circle cx="20" cy="20" r="15" /><!-- Comments should be removed --></svg>';
      const out = sanitizeSvg(raw);
      expect(out).not.toContain('<!--');
    });

    it('removes inline on* event handler attributes', () => {
      const raw = '<svg><g onclick="alert(1)">X</g></svg>';
      const out = sanitizeSvg(raw);
      expect(out).not.toContain(/onclick\s*=/i);
    });

    it('removes javascript: URIs in href and xlink:href', () => {
      const raw = '<svg><a href="javascript:alert(1)">bad</a><use xlink:href="javascript:alert(2)"></use><g/></svg>';
      const out = sanitizeSvg(raw);
      expect(out).toContain('<a');
      expect(out).not.toMatch(/href\s*=\s*['"]\s*javascript:/i);
      expect(out).not.toMatch(/xlink:href\s*=\s*['"]\s*javascript:/i);
      expect(out).toContain('<g');
    });

    it('removes <iframe>, <object> and <embed> blocks', () => {
      const raw = '<svg><iframe src="evil"></iframe><object data="evil"></object><embed src="evil" /></svg>';
      const out = sanitizeSvg(raw);
      expect(out).not.toMatch(/<embed\b/i);
      expect(out).not.toMatch(/<iframe\b/i);
      expect(out).not.toMatch(/<object\b/i);
      expect(out).not.toMatch(/data="evil"\b/i);
    });

    it('handles empty / falsy input gracefully', () => {
      expect(sanitizeSvg('')).toBe('');
      // biome-ignore lint/suspicious/noExplicitAny: any is acceptable in testing
      expect(sanitizeSvg(null as any)).toBe(null as any);
    });

    it('removes event handlers regardless of quote style and spacing', () => {
      const raw = "<svg><g ONCLICK = 'alert(1)'>X</g></svg>";
      const out = sanitizeSvg(raw);
      expect(/onclick/i.test(out)).toBe(false);
    });

    it('removes attributes not allowed in svg', () => {
      const raw = "<svg><g what other='ok'>X</g></svg>";
      const out = sanitizeSvg(raw);
      expect(out).not.toContain('what');
      expect(out).not.toContain('other="ok"');
    });

    it('removes event handlers embedded inside other attributes', () => {
      const raw = '<svg><g onmouseover=alert(1)>X</g></svg>';
      const out = sanitizeSvg(raw);
      expect(out).not.toContain(/onmouseover\s*=/i);
    });

    it('removes unknown tags and attributes', () => {
      const raw =
        '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
        '<javascript>alert(1)</javascript>' +
        '<vbscript>alert(1)</vbscript>' +
        '<!-- Grouping two circles and applying shared styles and a translation -->' +
        '<g vbscript fill="white" stroke="green" stroke-width="3" transform="translate(10, 10)">' +
        '<circle javascript cx="20" cy="20" r="15" />' +
        '<circle cx="60" cy="20" r="15" />' +
        '</g>' +
        '</svg>';

      const out = sanitizeSvg(raw);
      expect(out).not.toContain('javascript');
      expect(out).not.toContain('vbscript');
    });

    it('removes suspicious characters', () => {
      const expected =
        '<svg viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="currentColor"></rect></svg>';

      const raw =
        '<svg /\u0000/ &amp; &gt; &lt; &quot; &#39; viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="currentColor"></rect></svg>';

      const out = sanitizeSvg(raw);
      expect(out).toBe(expected);
    });

    it('does not remove safe SVG content', () => {
      const raw = '<svg viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="currentColor"></rect></svg>';
      const out = sanitizeSvg(raw);
      expect(out).toBe(raw);
    });

    it('does not remove data-* attributes', () => {
      const raw = '<svg data-svg="keep"><g data-test="keep">X</g></svg>';
      const out = sanitizeSvg(raw);
      expect(out).toContain('data-svg="keep"');
      expect(out).toContain('data-test="keep"');
    });
  });

  describe('sanitizeAttribute', () => {
    it('sanitizes attribute', () => {
      const result = sanitizeAttribute(['name', 'foo" onload="alert(1)']);
      expect(result).toBe('name="foo&quot; onload=&quot;alert(1)"');
    });

    it('throws when attribute value contain HTML tags', () => {
      expect(() => {
        sanitizeAttribute(['name', '<script>alert("XSS")</script>']);
      }).toThrow('The "name" attribute value cannot contain HTML tags.');
    });
  });

  describe('formatStyle', () => {
    it('returns the formatted style', () => {
      const style = {
        fill: 'white',
        stroke: 'green',
        'stroke-width': 3,
        transform: 'translate(10, 10)',
      } as const;

      const formattedStyle = formatStyle(style);
      expect(formattedStyle).toBe('fill: white; stroke: green; stroke-width: 3; transform: translate(10, 10);');
    });

    it('returns the formatted style as is when input is a string', () => {
      const style = 'fill: white; stroke: green; stroke-width: 3; transform: translate(10, 10);';
      const formattedStyle = formatStyle(style);
      expect(formattedStyle).toBe(style);
    });
  });

  describe('formatSize', () => {
    it('defaults to 1em when size value is null or undefined and default value is not provided', () => {
      expect(formatSize(undefined)).toBe('1em');
      expect(formatSize(null)).toBe('1em');
    });

    it('uses default value when size value is null or undefined', () => {
      expect(formatSize(undefined, '1px')).toBe('1px');
      expect(formatSize(null, '1px')).toBe('1px');
    });

    it('a number value is converted to em', () => {
      expect(formatSize(2, '1px')).toBe('2em');
      expect(formatSize(0.083, '1px')).toBe('0.083em');
    });

    it('a string value is returned as is', () => {
      expect(formatSize('2', '1px')).toBe('2');
      expect(formatSize('2px', '1px')).toBe('2px');
      expect(formatSize('', '1px')).toBe('');
    });
  });
});
