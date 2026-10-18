// @vitest-environment node
import { renderAstro } from '@olsen-mono/astro-test-utils';
import { describe, expect, it } from 'vitest';
import LinesIcon from '../LinesIcon.astro';

describe('LinesIcon defaults', () => {
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
