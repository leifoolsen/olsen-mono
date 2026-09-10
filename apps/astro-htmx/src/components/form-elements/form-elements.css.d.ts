export type Css = 
  | 'bordered'
  | 'checkboxInput'
  | 'chevronIcon'
  | 'clearIcon'
  | 'comboboxContainer'
  | 'comboboxInput'
  | 'comboboxResultsPopover'
  | 'errorMessage'
  | 'fieldGroup'
  | 'icon'
  | 'iconOff'
  | 'iconOn'
  | 'infoIcon'
  | 'infoTooltipPopover'
  | 'inputContainer'
  | 'inputGroup'
  | 'isActive'
  | 'labelBefore'
  | 'labelTop'
  | 'listbox'
  | 'listboxGroup'
  | 'listboxGroupLabel'
  | 'listboxOption'
  | 'orientationColumn'
  | 'orientationRow'
  | 'popoverDescription'
  | 'popoverTriggerBtn'
  | 'radioInput'
  | 'rangeContainer'
  | 'rangeInput'
  | 'rangeNumberInput'
  | 'searchIcon'
  | 'selectContainer'
  | 'selectInput'
  | 'textInput'
  | 'textareaContainer'
  | 'textareaInput'
  | 'toggleSwitch'
  | 'toolBtn';
export type CssVariables = 
  | '--input-background-active-color'
  | '--input-background-color'
  | '--input-background-disabled-color'
  | '--input-background-hover-color';
export type DataShowMarker = 'true' | (string & {}) | boolean | undefined;
export type CssDataAttributes = {
  'data-show-marker': DataShowMarker;
};
declare const styles: Record<Css, string>;
export default styles;
