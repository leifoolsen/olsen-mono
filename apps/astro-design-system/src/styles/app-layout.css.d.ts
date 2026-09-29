export type Css = 
  | 'appGrid'
  | 'appHeader'
  | 'appHeaderLeft'
  | 'appHeaderRight'
  | 'appMain'
  | 'appSidebar'
  | 'appSidebarNavList'
  | 'appSidebarToggle';
export type CssVariables = never;
export type DataSidebarCollapsed = 'false' | 'true' | (string & {}) | boolean | undefined;
export type CssDataAttributes = {
  'data-sidebar-collapsed': DataSidebarCollapsed;
};
declare const styles: Record<Css, string>;
export default styles;
