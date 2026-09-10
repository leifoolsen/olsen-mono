export type Css = 'appGrid' | 'appHeader' | 'appHeaderLeft' | 'appHeaderRight' | 'appMain' | 'appSidebar' | 'appSidebarNavList' | 'appSidebarToggle';
export type CssVariables = never;
export type DataSidebarCollapsed = 'false' | 'true';
export type CssDataAttributes = {
  'data-sidebar-collapsed': DataSidebarCollapsed;
};
declare const styles: {
  'appGrid': string;
  'appHeader': string;
  'appHeaderLeft': string;
  'appHeaderRight': string;
  'appMain': string;
  'appSidebar': string;
  'appSidebarNavList': string;
  'appSidebarToggle': string;
};
export default styles;
