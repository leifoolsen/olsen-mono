import { describe, expect, it } from 'vitest';
import { applicationMenuItems } from '../application-menu';

describe('application menu items', () => {
  it('defines unique links for every design-system sample page', () => {
    const hrefs = applicationMenuItems.map(({ href }) => href);

    expect(hrefs).toEqual([
      '/typography',
      '/colors',
      '/sizes',
      '/shadows',
      '/form-elements',
      '/morph-icons',
      '/html5-test-page',
    ]);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(applicationMenuItems.every(({ label }) => label.length > 0)).toBe(true);
  });
});
