import type { Config } from 'stylelint';

const config: Config = {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['property', 'function', 'mixin'],
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['result'],
      },
    ],
    'at-rule-descriptor-no-unknown': null,
    'no-invalid-position-at-import-rule': null,
    'color-hex-length': 'long',
    'color-no-invalid-hex': true,
    'import-notation': 'string',
    'number-max-precision': 14,
    'selector-class-pattern': [
      '^[a-z]+([A-Z][a-z0-9]+)*$|^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
      {
        severity: 'warning',
        message: 'It is recommended to use camelCase or kebab-case',
      },
    ],
    'custom-property-pattern': [
      '^_?[a-z][a-z0-9]*(-[a-z0-9]+)*$',
      {
        message: 'Expected custom property name to be kebab-case or start with an underscore',
      },
    ],
  },
};

export default config;
