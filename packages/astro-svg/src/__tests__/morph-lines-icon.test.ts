// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { asteriskLines, plusLines, tripleLines, xLines } from '../line-icons';
import { createMorphLinesIcon, type MorphLinesIconElement } from '../morph-lines-icon';

describe('createMorphLinesIcon', () => {
  const createSvgElement = (airy = false): MorphLinesIconElement => {
    const svg = document.createElementNS('http://w3.org', 'svg') as unknown as MorphLinesIconElement;
    if (airy) svg.setAttribute('data-airy', '');
    createMorphLinesIcon(svg);
    return svg;
  };

  it('attaches setFromToLines API and creates line elements dynamically', () => {
    const svg = createSvgElement();
    expect(typeof svg.setFromToLines).toBe('function');

    svg.setFromToLines(tripleLines, xLines);

    const lines = svg.querySelectorAll('line');
    expect(lines).toHaveLength(3);
    expect(lines[0]?.getAttribute('vector-effect')).toBe('non-scaling-stroke');
    expect(lines[0]?.style.getPropertyValue('--target-transform')).toContain('rotate(');
  });

  it('reuses existing <line> elements and removes excess lines when shrinking', () => {
    const svg = createSvgElement();

    // First render with 4 lines (asteriskLines)
    svg.setFromToLines(asteriskLines, tripleLines);
    const initialLines = Array.from(svg.querySelectorAll('line'));
    expect(initialLines).toHaveLength(4);

    // Update to 2 lines (plusLines -> plusLines)
    svg.setFromToLines(plusLines, plusLines);
    const updatedLines = Array.from(svg.querySelectorAll('line'));
    expect(updatedLines).toHaveLength(2);
    // Reuses the same DOM nodes for indices 0 and 1
    expect(updatedLines[0]).toBe(initialLines[0]);
    expect(updatedLines[1]).toBe(initialLines[1]);
  });

  it('respects data-airy when updating lines dynamically', () => {
    const svg = createSvgElement(true);
    svg.setFromToLines([{ x1: 4, y1: 12, x2: 20, y2: 12 }], [{ x1: 12, y1: 4, x2: 12, y2: 20 }]);

    const line = svg.querySelector('line');
    expect(line?.getAttribute('x1')).toBe('6');
    expect(line?.getAttribute('x2')).toBe('18');
  });
});
