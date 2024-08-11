const fs = require('fs');
const path = require('path');

function getDirectories(path = './') {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);
}

const importOrderPaths = getDirectories(path.join(__dirname, 'src')).map(
  (dir) => `/^@${dir}/`,
);

/**
 * @type {import('eslint').Linter.BaseConfig}
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['@typescript-eslint/eslint-plugin', 'import-helpers'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 90,
      },
    ],
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        alphabetize: { order: 'asc', ignoreCase: true },
        groups: [
          ['module'],
          ...importOrderPaths,
          ['parent', 'sibling'],
          'index',
        ],
      },
    ],
  },
};
