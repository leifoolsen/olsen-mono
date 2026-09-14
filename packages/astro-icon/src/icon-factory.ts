type ViteGlobResult =
  | Record<string, string>
  | Record<string, { default: string }>
  | Record<string, () => Promise<unknown>>;

export function createIconSystem<TMapping extends Record<string, { file: string; scale?: string | number }>>(
  mapping: TMapping,
  globResult: ViteGlobResult,
) {
  const iconRegistry = new Map<string, string>();

  for (const path in globResult) {
    const fullFileName = path.split('/').pop()?.replace('.svg', '');
    if (!fullFileName) continue;

    const module = globResult[path];
    const rawSvg = typeof module === 'object' && 'default' in module ? module.default : '';

    if (rawSvg) {
      iconRegistry.set(fullFileName, rawSvg);
    }
  }

  function getSvgData(name: keyof TMapping) {
    const iconConfig = mapping[name];
    if (!iconConfig) {
      throw new Error(`Ikonet "${String(name)}" er ikke definert i din ikon-mapping.`);
    }

    const rawSvg = iconRegistry.get(iconConfig.file);
    if (!rawSvg) {
      throw new Error(`Ikonfilen "${iconConfig.file}.svg" ble ikke funnet i mappen.`);
    }

    return {
      rawSvg,
      scale: iconConfig.scale || undefined,
    };
  }

  /**
   * Genererer en ferdig CSS-maskeverdi med 100% typesikkerhet
   */
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
