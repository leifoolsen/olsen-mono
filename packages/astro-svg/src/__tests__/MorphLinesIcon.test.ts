// @vitest-environment node
import { renderAstro } from '@olsen-mono/astro-test-utils';
import { describe, expect, it } from 'vitest';
import { plusLines, tripleLines, xLines } from '../line-icons';
import MorphLinesIcon from '../MorphLinesIcon.astro';

describe('MorphLinesIcon.astro', () => {
  describe('Basic rendering', () => {
    it('renders SVG with matched line segments and default attributes', async () => {
      const { container } = await renderAstro(MorphLinesIcon, {
        fromLines: tripleLines,
        toLines: xLines,
      });

      const svg = container.querySelector('svg');

      expect(svg).not.toBeNull();
      expect(svg?.hasAttribute('data-morph-icon')).toBe(true);
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg?.getAttribute('width')).toBe('1em');
      expect(svg?.getAttribute('height')).toBe('1em');
      expect(svg?.getAttribute('stroke-width')).toBe('2');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');

      const lines = svg?.querySelectorAll('line');
      expect(lines).toHaveLength(3);

      lines?.forEach((line, index) => {
        expect(line.getAttribute('vector-effect')).toBe('non-scaling-stroke');
        const style = line.getAttribute('style') ?? '';
        expect(style).toContain(`--line-index:${index}`);
        expect(style).toContain('--origin:');
        expect(style).toContain('--target-transform:');
      });
    });

    it('pads shorter line arrays to match the longer array', async () => {
      const { container, html } = await renderAstro(MorphLinesIcon, {
        fromLines: plusLines, // 2 lines
        toLines: tripleLines, // 3 lines
      });

      console.log(html);

      const lines = container.querySelectorAll('svg line');
      expect(lines).toHaveLength(3);

      // The padded center point starts widened (x1=11, x2=13) with --start-opacity: 0
      const paddedLine = Array.from(lines).find((l) => (l.getAttribute('style') ?? '').includes('--start-opacity:0'));
      expect(paddedLine).toBeDefined();
      expect(paddedLine?.getAttribute('x1')).toBe('11');
      expect(paddedLine?.getAttribute('x2')).toBe('13');
    });
  });

  describe('Size, airy, stroke-width, and animation props', () => {
    it('formats numeric and string sizes', async () => {
      const { container: numContainer } = await renderAstro(MorphLinesIcon, {
        fromLines: plusLines,
        toLines: xLines,
        size: 1.5,
      });
      expect(numContainer.querySelector('svg')?.getAttribute('width')).toBe('1.5em');
      expect(numContainer.querySelector('svg')?.getAttribute('height')).toBe('1.5em');

      const { container: strContainer } = await renderAstro(MorphLinesIcon, {
        fromLines: plusLines,
        toLines: xLines,
        size: '24px',
      });
      expect(strContainer.querySelector('svg')?.getAttribute('width')).toBe('24px');
      expect(strContainer.querySelector('svg')?.getAttribute('height')).toBe('24px');
    });

    it('scales coordinates and sets data-airy when airy is true', async () => {
      const { container } = await renderAstro(MorphLinesIcon, {
        fromLines: [{ x1: 4, y1: 12, x2: 20, y2: 12 }],
        toLines: [{ x1: 12, y1: 4, x2: 12, y2: 20 }],
        airy: true,
      });

      const svg = container.querySelector('svg');
      expect(svg?.hasAttribute('data-airy')).toBe(true);

      const line = svg?.querySelector('line');
      expect(line?.getAttribute('x1')).toBe('6');
      expect(line?.getAttribute('x2')).toBe('18');
    });

    it('applies duration, stagger, rotate, and custom styles on the root SVG', async () => {
      const { container } = await renderAstro(MorphLinesIcon, {
        fromLines: plusLines,
        toLines: xLines,
        duration: '0.4s',
        stagger: '0.08s',
        rotate: '90deg',
        style: { color: 'rebeccapurple' },
      });

      const style = container.querySelector('svg')?.getAttribute('style') ?? '';
      expect(style).toContain('--morph-duration: 0.4s;');
      expect(style).toContain('--stagger-base: 0.08s;');
      expect(style).toContain('--svg-rotate: 90deg;');
      expect(style).toContain('color: rebeccapurple;');
    });
  });

  describe('Interactive & Accessibility states', () => {
    it('sets aria-checked, aria-disabled, and data-hover attributes', async () => {
      const { container } = await renderAstro(MorphLinesIcon, {
        fromLines: tripleLines,
        toLines: xLines,
        active: true,
        disabled: true,
        hover: true,
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('aria-checked')).toBe('true');
      expect(svg?.getAttribute('aria-disabled')).toBe('true');
      expect(svg?.hasAttribute('data-hover')).toBe(true);
    });

    it('sets role="img" and removes aria-hidden when aria-label is provided', async () => {
      const { container } = await renderAstro(MorphLinesIcon, {
        fromLines: tripleLines,
        toLines: xLines,
        'aria-label': 'Toggle navigation',
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('role')).toBe('img');
      expect(svg?.getAttribute('aria-label')).toBe('Toggle navigation');
      expect(svg?.hasAttribute('aria-hidden')).toBe(false);
    });
  });
});
