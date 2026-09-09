export type Css = never;
export type CssVariables = '--accent-color' | '--base-c' | '--base-h' | '--base-l' | '--border-color' | '--brand-contrast' | '--brand-text-color' | '--chroma-error' | '--chroma-info' | '--chroma-neutral' | '--chroma-primary' | '--chroma-quaternary' | '--chroma-secondary' | '--chroma-success' | '--chroma-tertiary' | '--chroma-warning' | '--color-100' | '--color-200' | '--color-300' | '--color-400' | '--color-50' | '--color-500' | '--color-600' | '--color-700' | '--color-800' | '--color-900' | '--color-950' | '--color-A100' | '--color-A200' | '--color-A400' | '--color-A700' | '--global-brand-text' | '--hue-error' | '--hue-info' | '--hue-neutral' | '--hue-primary' | '--hue-quaternary' | '--hue-secondary' | '--hue-success' | '--hue-tertiary' | '--hue-warning' | '--lightness-error' | '--lightness-info' | '--lightness-neutral' | '--lightness-primary' | '--lightness-quaternary' | '--lightness-secondary' | '--lightness-success' | '--lightness-tertiary' | '--lightness-warning' | '--muted-text' | '--normal-text' | '--raw-contrast' | '--subtle-text' | '--swatch-color' | '--system-border-color' | '--system-brand-color';
export type DataColor = '100' | '200' | '300' | '400' | '50' | '500' | '600' | '700' | '800' | '900' | '950' | 'A100' | 'A200' | 'A400' | 'A700';
export type DataVariant = 'danger' | 'error' | 'info' | 'neutral' | 'primary' | 'quaternary' | 'secondary' | 'success' | 'surface' | 'surface-1' | 'surface-2' | 'tertiary' | 'warning';
export type DataText = 'brand' | 'muted' | 'normal' | 'subtle';
export type DataTheme = 'dark' | 'light';
export type CssDataAttributes = {
  'data-color': DataColor;
  'data-variant': DataVariant;
  'data-text': DataText;
  'data-theme': DataTheme;
};
declare const styles: string;
export default styles;
