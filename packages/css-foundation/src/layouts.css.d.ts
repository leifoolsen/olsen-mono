export type Css = never;
export type CssVariables = never;
export type DataLayout = 'ram' | 'row' | (string & {}) | boolean | undefined;
export type DataColumns = string | boolean | undefined;
export type CssDataAttributes = {
  'data-layout': DataLayout;
  'data-columns': DataColumns;
};
declare const styles: string;
export default styles;
