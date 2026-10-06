// packages/astro-icons/src/morph-icon.ts
import type { LineSegment, MorphIconApi } from './types.ts';
import { computeLineMorph, matchLines, scaleLines } from './utils.ts';

export function createMorphLineIcon(svgElement: SVGElement) {
  const isAiry = svgElement.hasAttribute('data-airy');

  const setFromToLines = (rawFromLines: LineSegment[], rawToLines: LineSegment[]) => {
    const fromScaled = scaleLines(rawFromLines, isAiry ? 0.75 : 1);
    const toScaled = scaleLines(rawToLines, isAiry ? 0.75 : 1);

    const { fromLines, toLines } = matchLines(fromScaled, toScaled);

    const morphs = fromLines.map((from, index) => computeLineMorph(from, toLines[index] ?? from));
    const existingLines = svgElement.querySelectorAll('line');

    morphs.forEach(({ line, origin, moveX, moveY, angle, scale, startOpacity, targetOpacity }, index) => {
      let lineEl = existingLines[index] as SVGLineElement | undefined;

      if (!lineEl) {
        lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineEl.setAttribute('vector-effect', 'non-scaling-stroke');
        svgElement.appendChild(lineEl);
      }

      lineEl.setAttribute('x1', line.x1.toString());
      lineEl.setAttribute('y1', line.y1.toString());
      lineEl.setAttribute('x2', line.x2.toString());
      lineEl.setAttribute('y2', line.y2.toString());
      lineEl.style.setProperty('--origin', `${origin.x}px ${origin.y}px`);
      lineEl.style.setProperty('--start-opacity', startOpacity.toString());
      lineEl.style.setProperty(
        '--target-transform',
        `translate(${moveX}px, ${moveY}px) rotate(${angle}deg) scale(${scale})`,
      );
      lineEl.style.setProperty('--target-opacity', targetOpacity.toString());
      lineEl.style.setProperty('--line-index', index.toString());
    });

    if (existingLines.length > morphs.length) {
      for (let i = morphs.length; i < existingLines.length; i++) {
        existingLines[i]?.remove();
      }
    }
  };

  Object.assign(svgElement, {
    setFromToLines,
  });

  const api: MorphIconApi = {
    setFromToLines,
  };

  return api;
}

export type MorphIconElement = SVGSVGElement & MorphIconApi;
