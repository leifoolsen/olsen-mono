declare module '*.astro' {
  type AstroComponentFactory = import('astro').AstroComponentFactory;
  const Component: AstroComponentFactory;
  export default Component;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
