/** @type {import("prettier").Config} */
const config = {
  plugins: ['prettier-plugin-astro'],
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    // Prettier is only used for formatting Astro files, until Biome's HTML formatter fully supports Astro markup
    {
      files: '*',
      options: {
        requirePragma: true,
      },
    },
    {
      files: '*.astro',
      options: {
        parser: 'astro',
        requirePragma: false,
      },
    },
  ],
};

export default config;
