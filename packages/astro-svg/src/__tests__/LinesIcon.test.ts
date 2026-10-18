// @vitest-environment node
import { renderAstro } from '@olsen-mono/astro-test-utils';
import { describe, expect, it } from 'vitest';
import LinesIcon from '../LinesIcon.astro';
import type { LineSegment } from '../types.ts';

describe('LinesIcon.astro', () => {
  const lines: LineSegment[] = [
    { x1: 4, y1: 12, x2: 20, y2: 12 },
    { x1: 12, y1: 4, x2: 12, y2: 20 },
    { x1: 6, y1: 6, x2: 18, y2: 18 },
    { x1: 6, y1: 18, x2: 18, y2: 6 },
  ];

  describe('basic rendering', () => {
    it('should render LinesIcon successfully', async () => {
      const { container } = await renderAstro(LinesIcon, {
        name: 'asterisk-icon',
        lines,
        class: 'my-svg-icon',
      });

      const svg = container.querySelector('svg');

      expect(svg).not.toBeNull();
      expect(svg?.outerHTML).toContain('<svg');
      expect(svg?.outerHTML).toContain('viewBox="0 0 24 24"');
      expect(svg?.outerHTML).toContain('stroke="currentColor"');
      expect(svg?.outerHTML).toContain('stroke-linecap="round"');
      expect(svg?.getAttribute('stroke-linejoin')).toBe('round');
      expect(svg?.getAttribute('name')).toBe('asterisk-icon');
      expect(svg?.getAttribute('class')).toBe('my-svg-icon');

      const renderedLines = svg?.querySelectorAll('line');
      expect(renderedLines).toHaveLength(lines.length);

      lines.forEach((line, index) => {
        expect(renderedLines?.item(index)?.getAttribute('vector-effect')).toBe('non-scaling-stroke');
        expect(renderedLines?.item(index)?.getAttribute('x1')).toBe(String(line.x1));
        expect(renderedLines?.item(index)?.getAttribute('y1')).toBe(String(line.y1));
        expect(renderedLines?.item(index)?.getAttribute('x2')).toBe(String(line.x2));
        expect(renderedLines?.item(index)?.getAttribute('y2')).toBe(String(line.y2));
      });
    });

    it('defaults to 1em when no size is provided and applies outer stroke-width', async () => {
      const lines = [{ x1: 4, y1: 12, x2: 20, y2: 12 }];

      const { container } = await renderAstro(LinesIcon, {
        name: 'test-lines',
        lines,
        class: 'my-lines',
      });

      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg?.getAttribute('width')).toBe('1em');
      expect(svg?.getAttribute('height')).toBe('1em');
      // stroke-width should be set on the outer SVG element
      expect(svg?.getAttribute('stroke-width')).toBe('2');

      const line = svg?.querySelector('line');
      expect(line).not.toBeNull();
      // inner line elements should not carry stroke-width attribute (it was removed)
      expect(line?.hasAttribute('stroke-width')).toBe(false);
    });
  });
});
