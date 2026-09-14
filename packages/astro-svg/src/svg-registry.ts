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
type SvgRegistry = {
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
  const registry = new Map<string, string>();

  for (const path in globResult) {
    const fullFileName = path.split('/').pop()?.replace('.svg', '');
    if (!fullFileName) continue;

    const module = globResult[path];
    const rawSvg = typeof module === 'object' && 'default' in module ? module.default : '';

    if (rawSvg) {
      registry.set(fullFileName, rawSvg);
    }
  }

  function getSvgData(name: keyof TMapping) {
    const svgConfig = mapping[name];
    if (!svgConfig) {
      throw new Error(`"${String(name)}" does not exist in the icon mapping.`);
    }

    const rawSvg = registry.get(svgConfig.file);
    if (!rawSvg) {
      throw new Error(`"${svgConfig.file}.svg" was not found in the registry.`);
    }

    return {
      rawSvg,
      scale: svgConfig.scale || undefined,
    };
  }

  function getIconMask(name: keyof TMapping): string {
    const { rawSvg } = getSvgData(name);
    const processedSvg = rawSvg
      .replace(/stroke="[^"]+"/g, '')
      .replace(/fill="[^"]+"/g, '')
      .replace(/width="[^"]+"/g, '')
      .replace(/height="[^"]+"/g, '')
      .replace('<svg', '<svg fill="#000000"');

    return `url("data:image/svg+xml,${encodeURIComponent(processedSvg)}")`;
  }

  return {
    getSvgData,
    getIconMask,
  };
}
