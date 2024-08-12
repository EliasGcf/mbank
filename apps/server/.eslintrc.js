const fs = require('fs');
const path = require('path');

function getDirectories(path = './') {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);
}

function getFiles(path = './') {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name);
}

const folders = getDirectories(path.join(__dirname, 'src')).map((dir) => `/^@${dir}/`);

const files = getFiles(path.join(__dirname, 'src')).map((file) => `/^@${file.replace('.ts', '')}/`);

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
    '@typescript-eslint/no-var-requires': 'off',
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        alphabetize: { order: 'asc', ignoreCase: true },
        groups: [
          // that starts with 'node:'
          ['/^node:/'],
          ['module'],
          ...folders,
          files,
          ['parent', 'sibling'],
          'index',
        ],
      },
    ],
  },
};
