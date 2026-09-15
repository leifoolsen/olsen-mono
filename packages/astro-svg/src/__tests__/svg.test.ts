// @vitest-environment node
import { renderAstro } from '@olsen-mono/astro-test-utils';
import { describe, expect, it } from 'vitest';
import SvgComponent from '../svg.astro';

describe('svg.astro', () => {
  const mockSvgData = {
    rawSvg:
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="#333" stroke="#666"><circle cx="12" cy="12" r="10"/></svg>',
    scale: 1.5,
  };

  const mockGetSvgData = (_name: string) => mockSvgData;

  describe('basic rendering', () => {
    it('should render SVG with default scale from registry mapping', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'info-icon',
        getSvgData: mockGetSvgData,
        class: 'my-svg-icon',
      });

      const svg = container.querySelector('svg');

      expect(svg).not.toBeNull();
      expect(svg?.outerHTML).toContain('<svg');
      expect(svg?.outerHTML).toContain('viewBox="0 0 24 24"');
      expect(svg?.getAttribute('class')).toBe('my-svg-icon');
      expect(svg?.getAttribute('style')).toContain('width: 1.5em');
    });

    it('should apply aria-hidden="true" when no aria-label is provided', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'info-icon',
        getSvgData: mockGetSvgData,
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should apply role="img" and remove aria-hidden if aria-label is provided', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'info-icon',
        getSvgData: mockGetSvgData,
        'aria-label': 'Helpful description',
      });

      const svg = container.querySelector('svg');

      expect(svg?.getAttribute('role')).toBe('img');
      expect(svg?.getAttribute('aria-label')).toBe('Helpful description');
      expect(svg?.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should prioritize explicit size prop over default scale', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'info-icon',
        getSvgData: mockGetSvgData,
        size: '2rem',
      });

      const svg = container.querySelector('svg');

      expect(svg?.getAttribute('style')).toContain('width: 2rem');
      expect(svg?.getAttribute('style')).toContain('height: 2rem');
    });

    it('should remove original fill, stroke, width, and height attributes', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
      });

      const svg = container.querySelector('svg');

      expect(svg?.outerHTML).not.toContain('fill="#333"');
      expect(svg?.outerHTML).not.toContain('stroke="#666"');
      expect(svg?.outerHTML).not.toContain('width="24"');
      expect(svg?.outerHTML).not.toContain('height="24"');
    });

    it('should apply currentColor as default fill', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('fill')).toContain('currentColor');
    });
  });

  describe('size handling', () => {
    it('should use scale from getSvgData as default size', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('width: 1.5em');
      expect(svg?.outerHTML).toContain('height: 1.5em');
    });

    it('should override default scale with size prop', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        size: 2,
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('width: 2em');
      expect(svg?.outerHTML).toContain('height: 2em');
    });

    it('should handle string size values', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        size: '3em',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('width: 3em');
      expect(svg?.outerHTML).toContain('height: 3em');
    });

    it('should allow separate width and height', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        width: 2,
        height: 3,
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('width: 2em');
      expect(svg?.outerHTML).toContain('height: 3em');
    });

    it('should default to 1em when no size is specified', async () => {
      const noScaleData = { rawSvg: mockSvgData.rawSvg };
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: () => noScaleData,
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('width: 1em');
      expect(svg?.outerHTML).toContain('height: 1em');
    });
  });

  describe('custom styling', () => {
    it('should apply custom fill color', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        fill: '#ff0000',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('fill="#ff0000"');
    });

    it('should apply custom stroke', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        stroke: '#00ff00',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('stroke="#00ff00"');
    });

    it('should apply custom class', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        class: 'my-custom-class',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('class="my-custom-class"');
    });

    it('should merge custom styles with size styles', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        style: 'color: red;',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('width:');
      expect(svg?.outerHTML).toContain('color: red;');
    });
  });

  describe('accessibility', () => {
    it('should set aria-hidden when no aria-label or aria-labelledby', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('aria-hidden="true"');
    });

    it('should set role="img" when aria-label is provided', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        'aria-label': 'Test icon',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('role="img"');
      expect(svg?.outerHTML).toContain('aria-label="Test icon"');
      expect(svg?.outerHTML).not.toContain('aria-hidden');
    });

    it('should set role="img" when aria-labelledby is provided', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        'aria-labelledby': 'icon-title',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('role="img"');
      expect(svg?.outerHTML).toContain('aria-labelledby="icon-title"');
    });

    it('should allow custom role to override default', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        'aria-label': 'Test',
        role: 'presentation',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('role="presentation"');
    });
  });

  describe('additional HTML attributes', () => {
    it('should pass through additional SVG attributes', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        id: 'my-icon',
        'data-testid': 'svg-icon',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('id="my-icon"');
      expect(svg?.outerHTML).toContain('data-testid="svg-icon"');
    });

    it('should handle boolean attributes', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
        focusable: true,
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('focusable');
    });
  });

  describe('style calculations', () => {
    it('should include aspect-ratio and max-inline-size', async () => {
      const { container } = await renderAstro(SvgComponent, {
        name: 'test-icon',
        getSvgData: mockGetSvgData,
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('aspect-ratio: 1/1');
      expect(svg?.outerHTML).toContain('max-inline-size: unset');
    });
  });
});
