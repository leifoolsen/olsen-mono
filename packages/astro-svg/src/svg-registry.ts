// packages/astro-svg/src/svg-registry.ts

type ViteGlobResult =
  | Record<string, string>
  | Record<string, { default: string }>
  | Record<string, () => Promise<unknown>>;

/**
 * A registry for managing and retrieving SVG assets and related data.
 *
 * @property {function(string): {rawSvg: string, scale?: (string|number)}} getSvgData - Fetches the SVG data by name.
 *     The returned object contains the raw SVG string and an optional scale value.
 * @property {function(string): string} getIconMask - Retrieves the icon mask as a string based on the provided name.
 */

/**
 * Represents a registry for managing and retrieving SVG assets and icon masks by name.
 *
 * This type is used to encapsulate methods for accessing raw SVG data and icon masks
 * associated with specific names. The registry provides mechanisms to handle both the raw
 * SVG content and additional scaling information if applicable.
 *
 * @typedef {Object} SvgRegistry
 *
 * @property {function(string): { rawSvg: string, scale?: string | number }} getSvgData
 * Retrieves raw SVG data and optional scale information associated with a given name.
 * The `name` parameter corresponds to the identifier of the SVG asset.
 *
 * @property {function(string): string} getIconMask
 * Retrieves the icon mask associated with a given name.
 * The `name` parameter corresponds to the identifier of the icon mask.
 */
export type SvgRegistry = {
  getSvgData: (name: string) => { rawSvg: string; scale?: string | number };
  getIconMask: (name: string) => string;
};

/**
 * Creates an SVG registry that maps SVG icon names to their raw SVG data and provides utility methods for retrieving
 * the data and generating icon masks.
 *
 * @param {TMapping} mapping - A record of icon names mapped to their corresponding file and optional scale information.
 * @param {ViteGlobResult} globResult - The result of a Vite-specific file globbing operation, used to resolve and load SVG files.
 * @return {SvgRegistry} An object containing methods to retrieve raw SVG data or an icon mask for use in styles.
 */
export function createSvgRegistry<TMapping extends Record<string, { file: string; scale?: string | number }>>(
  mapping: TMapping,
  globResult: ViteGlobResult,
): SvgRegistry {
  const svgRegistry = new Map<string, string>();

  for (const path in globResult) {
    const fileName = path.split('/').pop()?.replace('.svg', '');
    if (!fileName) continue;

    const module = globResult[path];

    // Only process objects with the 'default' property (Vite's default export format)
    if (typeof module === 'object' && module !== null && 'default' in module) {
      const svgContent = module.default;

      if (typeof svgContent === 'string' && svgContent.trim()) {
        svgRegistry.set(fileName, svgContent);
      }
    }
  }

  function getSvgData(name: keyof TMapping): { rawSvg: string; scale?: string | number } {
    const svgConfig = mapping[name];

    if (!svgConfig) {
      const availableIcons = Object.keys(mapping).join(', ');
      throw new Error(
        `Please check your mapping. "${String(name)}" was not found in the registry. Available icons: ${availableIcons || 'none'}`,
      );
    }

    const rawSvg = svgRegistry.get(svgConfig.file);

    if (!rawSvg) {
      const availableFiles = Array.from(svgRegistry.keys()).join(', ');
      throw new Error(
        `Please check your mapping. "${svgConfig.file}.svg" was not found in the registry. Available files: ${availableFiles || 'none'}`,
      );
    }

    return {
      rawSvg,
      scale: svgConfig.scale,
    };
  }

  function getIconMask(name: keyof TMapping): string {
    const { rawSvg } = getSvgData(name);

    // Remove styling attributes and dimensions, then add black fill for masking
    const processedSvg = rawSvg
      .replace(/\s*stroke="[^"]*"/g, '')
      .replace(/\s*fill="[^"]*"/g, '')
      .replace(/\s*width="[^"]*"/g, '')
      .replace(/\s*height="[^"]*"/g, '')
      .replace('<svg', '<svg fill="#000000"');

    return `url("data:image/svg+xml,${encodeURIComponent(processedSvg)}")`;
  }

  return {
    getSvgData,
    getIconMask,
  };
}
