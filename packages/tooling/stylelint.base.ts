import type { Config } from 'stylelint';

const config: Config = {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['at-root', 'define-mixin', 'mixin'],
      },
    ],
    'color-hex-length': 'long',
    'color-no-invalid-hex': true,
    'number-max-precision': 14,
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]+|[a-z][a-z0-9-]+$',
      {
        severity: 'warning',
        message: 'It is recommended to use camelCase or kebab-case',
      },
    ],
  },
};

export default config;
