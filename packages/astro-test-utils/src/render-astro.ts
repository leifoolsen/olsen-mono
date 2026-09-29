// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { Window } from 'happy-dom';

// biome-ignore lint/suspicious/noExplicitAny: any is ok here
type ExtractAstroProps<T> = T extends (result: any, props: infer P, ...args: any[]) => any ? P : never;

/**
 * Represents the result of rendering an Astro component in a Node / Happy DOM environment.
 *
 * @property {string} html - The rendered HTML string of the component.
 * @property {DocumentFragment} container - The `DocumentFragment` containing the rendered component.
 */
type RenderAstroResult = {
  html: string;
  container: DocumentFragment;
};

/**
 * Renders an Astro component in a Node / Happy DOM environment and returns the rendered HTML along with the container.
 *
 * @param Component - The Astro component to be rendered. This must extend the `AstroComponentFactory`.
 * @param props - The props to be passed to the Astro component.
 * @return {Promise<RenderAstroResult>} A promise that resolves to an object containing the rendered HTML as a string
 *                                      and the container as a `DocumentFragment`.
 * @see {@link https://angelika.me/2025/02/01/astro-component-unit-tests/ How to set up unit tests for Astro components}
 *  - which was the original source of inspiration for this implementation.
 */
export async function renderAstro<T extends AstroComponentFactory>(
  Component: T,
  props: ExtractAstroProps<T>,
): Promise<RenderAstroResult> {
  const containerInstance = await AstroContainer.create();

  // biome-ignore lint/suspicious/noExplicitAny: any is ok here
  const html = await containerInstance.renderToString(Component, { props: props as any });

  const window = new Window({ url: 'http://localhost:4321' });
  window.document.write('<html lang="en"><body></body></html>');
  await window.happyDOM.waitUntilComplete();

  const template = window.document.createElement('template');
  template.innerHTML = html;

  const container = template.content as unknown as DocumentFragment;
  await window.happyDOM.close();

  return { html, container };
}
