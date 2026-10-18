// @vitest-environment node
import { renderAstro } from '@olsen-mono/astro-test-utils';
import { describe, expect, it } from 'vitest';
import SvgComponent from '../SvgIcon.astro';

describe('SvgIcon.astro', () => {
  const RAW_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" stroke-width="4" viewBox="0 0 24 24">' +
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />' +
    '</svg>';

  describe('Basic rendering', () => {
    it('should render SVG with default width, height and stroke width', async () => {
      const RENDERED_SVG =
        '<svg class="my-svg-icon" style="max-inline-size: unset;" name="info-icon" height="1em" width="1em" stroke-width="2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>';

      const { container } = await renderAstro(SvgComponent, {
        class: 'my-svg-icon',
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        name: 'info-icon',
      });

      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();

      const renderedSvg = svg?.outerHTML;
      expect(renderedSvg).toMatch(RENDERED_SVG);

      expect(svg?.getAttribute('class')).toBe('my-svg-icon');
      expect(svg?.getAttribute('name')).toBe('info-icon');
      expect(svg?.getAttribute('height')).toBe('1em');
      expect(svg?.getAttribute('width')).toBe('1em');
      expect(svg?.getAttribute('stroke-width')).toBe('2');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');

      const path = svg?.querySelector('path');
      expect(path?.hasAttribute('stroke-width')).toBe(false);
    });
  });

  describe('Width, height and size handling', () => {
    it('should default to 1em when no size, width or height prop, or defaultSize is provided', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('1em');
      expect(svg?.getAttribute('height')).toBe('1em');
    });

    it('should prioritize defaultSize when no size, width or height prop is provided', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG, defaultSize: '10px' }),
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('10px');
      expect(svg?.getAttribute('height')).toBe('10px');
    });

    it('should prioritize explicit size prop over defaultSize', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG, defaultSize: '10px' }),
        size: '2rem',
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('2rem');
      expect(svg?.getAttribute('height')).toBe('2rem');
    });

    it('should prioritize explicit width and height prop over size prop and defaultSize', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG, defaultSize: '10px' }),
        size: '2rem',
        width: '24px',
        height: '16px',
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('24px');
      expect(svg?.getAttribute('height')).toBe('16px');
    });

    it('should set a numeric defaultSize as em', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG, defaultSize: 1.2 }),
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('1.2em');
      expect(svg?.getAttribute('height')).toBe('1.2em');
    });

    it('should set a string defaultSize as is', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG, defaultSize: '48' }),
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('48');
      expect(svg?.getAttribute('height')).toBe('48');
    });

    it('should set a numeric size prop as em', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG, defaultSize: '10px' }),
        size: 1.2,
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('1.2em');
      expect(svg?.getAttribute('height')).toBe('1.2em');
    });

    it('should set a numeric width and height prop as em', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        width: 1.5,
        height: 1.5,
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('1.5em');
      expect(svg?.getAttribute('height')).toBe('1.5em');
    });

    it('should set a string width and height prop as is', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        width: '32',
        height: '32',
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('32');
      expect(svg?.getAttribute('height')).toBe('32');
    });
  });

  describe('stroke-width handling', () => {
    it('stroke-width should default to "2"', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('stroke-width')).toBe('2');
    });

    it('a numeric stroke-width should be set as em', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        'stroke-width': 0.083,
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('stroke-width')).toBe('0.083em');
    });

    it('a string stroke-width should be set as is', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        'stroke-width': '3px',
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('stroke-width')).toBe('3px');
    });
  });

  describe('Accessibility', () => {
    it('should apply aria-hidden="true" when no aria-label is provided', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should apply role="img" and remove aria-hidden if aria-label is provided', async () => {
      const { container } = await renderAstro(SvgComponent, {
        'aria-label': 'Helpful description',
        getSvgData: () => ({ rawSvg: RAW_SVG }),
      });

      const svg = container.querySelector('svg');

      expect(svg?.getAttribute('role')).toBe('img');
      expect(svg?.getAttribute('aria-label')).toBe('Helpful description');
      expect(svg?.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should set role="img" when aria-labelledby is provided', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        'aria-labelledby': 'icon-title',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('role="img"');
      expect(svg?.outerHTML).toContain('aria-labelledby="icon-title"');
    });

    it('should allow custom role to override default', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
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
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        id: 'my-icon',
        'data-testid': 'svg-icon',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('name="test-icon"');
      expect(svg?.outerHTML).toContain('id="my-icon"');
      expect(svg?.outerHTML).toContain('data-testid="svg-icon"');
    });

    it('should handle boolean attributes', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        focusable: true,
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('focusable');
      expect(svg?.getAttribute('focusable')).toBe('true');
    });
  });

  describe('Custom styling', () => {
    it('should apply custom fill color', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        fill: '#ff0000',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('fill="#ff0000"');
    });

    it('should apply custom stroke', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        stroke: '#00ff00',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('stroke="#00ff00"');
    });

    it('should apply custom class', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        class: 'my-custom-class',
      });

      const svg = container.querySelector('svg');
      expect(svg?.outerHTML).toContain('class="my-custom-class"');
    });

    it('should merge custom styles with default styles', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        style: 'color: red;',
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('style')).toBe('max-inline-size: unset; color: red;');
    });

    it('should merge custom style object with default styles', async () => {
      const { container } = await renderAstro(SvgComponent, {
        getSvgData: () => ({ rawSvg: RAW_SVG }),
        style: { color: 'red' },
      });

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('style')).toBe('max-inline-size: unset; color: red;');
    });
  });

  describe('Prevevent XSS', () => {
    it('should throw if "name" contain any potentially harmful characters that could be used to inject malicious code into the SVG', async () => {
      await expect(
        renderAstro(SvgComponent, {
          getSvgData: () => ({ rawSvg: RAW_SVG }),
          name: '<script>alert("XSS")</script>',
        }),
      ).rejects.toThrow('[SvgIcon]: The "name" attribute cannot contain HTML tags or quotes.');
    });

    it('should throw if "id" contain any potentially harmful characters that could be used to inject malicious code into the SVG', async () => {
      await expect(
        renderAstro(SvgComponent, {
          getSvgData: () => ({ rawSvg: RAW_SVG }),
          id: '<script>alert("XSS")</script>',
        }),
      ).rejects.toThrow('[SvgIcon]: The "id" attribute cannot contain HTML tags or quotes.');
    });
  });
});
