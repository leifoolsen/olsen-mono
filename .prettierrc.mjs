/** @type {import("prettier").Config} */
const config = {
  plugins: ['prettier-plugin-astro'],
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  overrides: [
    // Prettier is used for formatting Astro and MD files, until Biome's formatter fully supports Astro and MarkDown
    {
      files: '*',
      options: {
        requirePragma: true,
      },
    },
    {
      files: ['*.astro', '*.md'],
      options: {
        requirePragma: false,
      },
    },
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};

export default config;
