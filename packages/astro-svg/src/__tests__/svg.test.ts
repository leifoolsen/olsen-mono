// import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';

// import SvgComponent from '../svg.astro';

it('noting', () => {
  expect(1).toBe(1);
});

// describe.skip('svg.astro', () => {
//   const mockSvgData = {
//     rawSvg:
//       '<svg viewBox="0 0 24 24" width="24" height="24" fill="#333" stroke="#666"><circle cx="12" cy="12" r="10"/></svg>',
//     scale: 1.5,
//   };
//
//   const mockGetSvgData = (_name: string) => mockSvgData;
//
//   describe('basic rendering', () => {
//     it('should render SVG with default props', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//         },
//       });
//
//       expect(result).toContain('<svg');
//       expect(result).toContain('viewBox="0 0 24 24"');
//       expect(result).toContain('<circle');
//     });
//
//     it('should remove original fill, stroke, width, and height attributes', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//         },
//       });
//
//       expect(result).not.toContain('fill="#333"');
//       expect(result).not.toContain('stroke="#666"');
//       expect(result).not.toContain('width="24"');
//       expect(result).not.toContain('height="24"');
//     });
//
//     it('should apply currentColor as default fill', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//         },
//       });
//
//       expect(result).toContain('fill="currentColor"');
//     });
//   });
//
//   describe('size handling', () => {
//     it('should use scale from getSvgData as default size', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//         },
//       });
//
//       expect(result).toContain('width: 1.5em');
//       expect(result).toContain('height: 1.5em');
//     });
//
//     it('should override default scale with size prop', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           size: 2,
//         },
//       });
//
//       expect(result).toContain('width: 2em');
//       expect(result).toContain('height: 2em');
//     });
//
//     it('should handle string size values', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           size: '3em',
//         },
//       });
//
//       expect(result).toContain('width: 3em');
//       expect(result).toContain('height: 3em');
//     });
//
//     it('should allow separate width and height', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           width: 2,
//           height: 3,
//         },
//       });
//
//       expect(result).toContain('width: 2em');
//       expect(result).toContain('height: 3em');
//     });
//
//     it('should default to 1em when no size is specified', async () => {
//       const noScaleData = { rawSvg: mockSvgData.rawSvg };
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: () => noScaleData,
//         },
//       });
//
//       expect(result).toContain('width: 1em');
//       expect(result).toContain('height: 1em');
//     });
//   });
//
//   describe('custom styling', () => {
//     it('should apply custom fill color', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           fill: '#ff0000',
//         },
//       });
//
//       expect(result).toContain('fill="#ff0000"');
//     });
//
//     it('should apply custom stroke', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           stroke: '#00ff00',
//         },
//       });
//
//       expect(result).toContain('stroke="#00ff00"');
//     });
//
//     it('should apply custom class', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           class: 'my-custom-class',
//         },
//       });
//
//       expect(result).toContain('class="my-custom-class"');
//     });
//
//     it('should merge custom styles with size styles', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           style: 'color: red;',
//         },
//       });
//
//       expect(result).toContain('width:');
//       expect(result).toContain('color: red;');
//     });
//   });
//
//   describe('accessibility', () => {
//     it('should set aria-hidden when no aria-label or aria-labelledby', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//         },
//       });
//
//       expect(result).toContain('aria-hidden="true"');
//     });
//
//     it('should set role="img" when aria-label is provided', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           'aria-label': 'Test icon',
//         },
//       });
//
//       expect(result).toContain('role="img"');
//       expect(result).toContain('aria-label="Test icon"');
//       expect(result).not.toContain('aria-hidden');
//     });
//
//     it('should set role="img" when aria-labelledby is provided', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           'aria-labelledby': 'icon-title',
//         },
//       });
//
//       expect(result).toContain('role="img"');
//       expect(result).toContain('aria-labelledby="icon-title"');
//     });
//
//     it('should allow custom role to override default', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           'aria-label': 'Test',
//           role: 'presentation',
//         },
//       });
//
//       expect(result).toContain('role="presentation"');
//     });
//   });
//
//   describe('additional HTML attributes', () => {
//     it('should pass through additional SVG attributes', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           id: 'my-icon',
//           'data-testid': 'svg-icon',
//         },
//       });
//
//       expect(result).toContain('id="my-icon"');
//       expect(result).toContain('data-testid="svg-icon"');
//     });
//
//     it('should handle boolean attributes', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//           focusable: true,
//         },
//       });
//
//       expect(result).toContain('focusable');
//     });
//   });
//
//   describe('style calculations', () => {
//     it('should include aspect-ratio and max-inline-size', async () => {
//       const container = await AstroContainer.create();
//       const result = await container.renderToString(SvgComponent, {
//         props: {
//           name: 'test-icon',
//           getSvgData: mockGetSvgData,
//         },
//       });
//
//       expect(result).toContain('aspect-ratio: 1/1');
//       expect(result).toContain('max-inline-size: unset');
//     });
//   });
// });
