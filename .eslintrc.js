module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:prettier/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
    'import/extensions': ['error', 'ignorePackages'],
  },
};
