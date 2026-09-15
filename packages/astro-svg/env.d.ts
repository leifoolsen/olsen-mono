declare module '*.astro' {
  type AstroComponentFactory = import('astro').AstroComponentFactory;
  const Component: AstroComponentFactory;
  export default Component;
}
