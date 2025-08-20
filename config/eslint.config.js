import parser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts','src/*.ts'],
    languageOptions: {
      parser,
    },
    rules: {
      'indent': [ 'error', 2, { "SwitchCase": 1 } ],
      'linebreak-style': [ 'error', 'unix' ],
      'quotes': [ 'error', 'single' ],
      'semi': [ 'error', 'always' ],
      'comma-dangle': [ 'error', 'always-multiline' ],
      '@typescript-eslint/no-explicit-any': 0,
    },
  },
];
