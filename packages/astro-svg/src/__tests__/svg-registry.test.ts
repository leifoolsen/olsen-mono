// packages/astro-svg/src/__tests__/svg-registry.test.ts
import { describe, expect, it } from 'vitest';
import { createSvgRegistry } from '../svg-registry';

describe('createSvgRegistry', () => {
  const mockSvgContent =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="#333" stroke="#666"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>';
  const mockSvgContent2 = '<svg viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="14"/></svg>';

  describe('getSvgData', () => {
    it('should retrieve SVG data from mapping', () => {
      const mapping = {
        home: { file: 'home-icon' },
        settings: { file: 'settings-icon', scale: 1.5 },
      };

      const globResult = {
        '/icons/home-icon.svg': { default: mockSvgContent },
        '/icons/settings-icon.svg': { default: mockSvgContent2 },
      };

      const registry = createSvgRegistry(mapping, globResult);
      const result = registry.getSvgData('home');

      expect(result.rawSvg).toBe(mockSvgContent);
      expect(result.scale).toBeUndefined();
    });

    it('should return scale if defined in mapping', () => {
      const mapping = {
        logo: { file: 'logo', scale: 2 },
      };

      const globResult = {
        '/icons/logo.svg': { default: mockSvgContent },
      };

      const registry = createSvgRegistry(mapping, globResult);
      const result = registry.getSvgData('logo');

      expect(result.scale).toBe(2);
    });

    it('should skip string values in glob result (not objects with default)', () => {
      const mapping = {
        arrow: { file: 'arrow' },
        home: { file: 'home' },
      };

      const globResult = {
        '/icons/arrow.svg': mockSvgContent, // This will be skipped (string, not object)
        '/icons/home.svg': { default: mockSvgContent2 }, // This will work
      };

      // @ts-expect-error - testing runtime error
      const registry = createSvgRegistry(mapping, globResult);

      expect(() => {
        registry.getSvgData('arrow');
      }).toThrow('"arrow.svg" was not found in the registry.');

      const result = registry.getSvgData('home');
      expect(result.rawSvg).toBe(mockSvgContent2);
    });

    it('should throw error when SVG name not in mapping', () => {
      const mapping = {
        home: { file: 'home-icon' },
      };

      const globResult = {
        '/icons/home-icon.svg': { default: mockSvgContent },
      };

      const registry = createSvgRegistry(mapping, globResult);

      expect(() => {
        registry.getSvgData('nonexistent');
      }).toThrow('Please check your mapping. "nonexistent" was not found in the registry.');
    });

    it('should throw error when SVG file not in registry', () => {
      const mapping = {
        home: { file: 'missing-file' },
      };

      const globResult = {
        '/icons/other-icon.svg': { default: mockSvgContent },
      };

      const registry = createSvgRegistry(mapping, globResult);

      expect(() => {
        registry.getSvgData('home');
      }).toThrow('"missing-file.svg" was not found in the registry.');
    });

    it('should handle nested paths in glob result', () => {
      const mapping = {
        user: { file: 'user-profile' },
      };

      const globResult = {
        '/assets/icons/nested/user-profile.svg': { default: mockSvgContent },
      };

      const registry = createSvgRegistry(mapping, globResult);
      const result = registry.getSvgData('user');

      expect(result.rawSvg).toBe(mockSvgContent);
    });
  });

  describe('getIconMask', () => {
    it('should generate CSS mask URL from SVG', () => {
      const mapping = {
        star: { file: 'star' },
      };

      const globResult = {
        '/icons/star.svg': { default: mockSvgContent },
      };

      const registry = createSvgRegistry(mapping, globResult);
      const mask = registry.getIconMask('star');

      expect(mask).toContain('url("data:image/svg+xml,');
      expect(mask).toContain('fill%3D%22%23000000%22');
    });

    it('should remove stroke, fill, width, and height attributes', () => {
      const mapping = {
        icon: { file: 'icon' },
      };

      const globResult = {
        '/icons/icon.svg': { default: mockSvgContent },
      };

      const registry = createSvgRegistry(mapping, globResult);
      const mask = registry.getIconMask('icon');

      const decodedMask = decodeURIComponent(mask.replace('url("data:image/svg+xml,', '').replace('")', ''));

      expect(decodedMask).not.toContain('stroke="#666"');
      expect(decodedMask).not.toContain('fill="#333"');
      expect(decodedMask).not.toContain('width="24"');
      expect(decodedMask).not.toContain('height="24"');
      expect(decodedMask).toContain('fill="#000000"');
    });

    it('should properly encode SVG for use in CSS', () => {
      const mapping = {
        check: { file: 'check' },
      };

      const svgWithSpecialChars = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>';

      const globResult = {
        '/icons/check.svg': { default: svgWithSpecialChars },
      };

      const registry = createSvgRegistry(mapping, globResult);
      const mask = registry.getIconMask('check');

      expect(mask).toMatch(/^url\("data:image\/svg\+xml,.*"\)$/);
    });

    it('should throw error when icon not found', () => {
      const mapping = {
        home: { file: 'home' },
      };

      const globResult = {
        '/icons/home.svg': { default: mockSvgContent },
      };

      const registry = createSvgRegistry(mapping, globResult);

      expect(() => {
        registry.getIconMask('unknown');
      }).toThrow('Please check your mapping. "unknown" was not found in the registry.');
    });
  });

  describe('edge cases', () => {
    it('should handle empty mapping', () => {
      const mapping = {};
      const globResult = {};

      const registry = createSvgRegistry(mapping, globResult);

      expect(() => {
        registry.getSvgData('anything');
      }).toThrow();
    });

    it('should handle glob result with no valid SVG files', () => {
      const mapping = {
        icon: { file: 'icon' },
      };

      const globResult = {
        '/not-an-svg.txt': { default: 'text content' },
      };

      const registry = createSvgRegistry(mapping, globResult);

      expect(() => {
        registry.getSvgData('icon');
      }).toThrow('"icon.svg" was not found in the registry.');
    });

    it('should handle scale value as string', () => {
      const mapping = {
        logo: { file: 'logo', scale: '1.5em' },
      };

      const globResult = {
        '/icons/logo.svg': { default: mockSvgContent },
      };

      const registry = createSvgRegistry(mapping, globResult);
      const result = registry.getSvgData('logo');

      expect(result.scale).toBe('1.5em');
    });
  });
});
