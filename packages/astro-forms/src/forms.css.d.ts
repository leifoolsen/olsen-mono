export type Css = 
  | 'formCheckboxInput'
  | 'formErrorMessage'
  | 'formInputContainer'
  | 'formInputGroup'
  | 'formRadioInput'
  | 'layoutAfter'
  | 'layoutBefore'
  | 'layoutTop';
export type CssVariables = 
  | '--form-accent-color'
  | '--form-border-color'
  | '--form-brand-text-color'
  | '--form-error-color'
  | '--form-font-size-s'
  | '--form-input-background-active-color'
  | '--form-input-background-color'
  | '--form-input-background-disabled-color'
  | '--form-input-background-hover-color'
  | '--form-input-scale'
  | '--form-muted-text'
  | '--form-space-2xs'
  | '--form-space-s'
  | '--form-space-xs';
export type CssDataAttributes = never;
declare const styles: Record<Css, string>;
export default styles;
