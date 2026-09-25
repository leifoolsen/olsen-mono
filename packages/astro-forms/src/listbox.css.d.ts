export type Css = 
  | 'bordered'
  | 'comboboxControl'
  | 'comboboxInput'
  | 'comboboxResultsPopover'
  | 'isActive'
  | 'listbox'
  | 'listboxGroup'
  | 'listboxGroupLabel'
  | 'listboxOption';
export type CssVariables = never;
export type DataShowMarker = 'true' | (string & {}) | boolean | undefined;
export type CssDataAttributes = {
  'data-show-marker': DataShowMarker;
};
declare const styles: Record<Css, string>;
export default styles;
