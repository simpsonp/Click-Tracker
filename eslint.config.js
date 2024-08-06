import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginNode from 'eslint-plugin-node';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';

const compat = new FlatCompat();

export default [
  {
    files: ['**/*.js'],
    ignores: ['.aws-sam/**/*.js'], // Exclude the AWS SAM Build artifacts directory
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: eslintPluginImport,
      node: eslintPluginNode,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...compat.extends('plugin:node/recommended').rules, // Apply recommended rules from eslint-plugin-node
      ...compat.extends('plugin:prettier/recommended').rules, // Apply recommended rules from eslint-plugin-node
      ...eslintConfigPrettier.rules, // Apply rules to turn off conflicting rules from eslint-config-prettier
      'prettier/prettier': 'error', // Ensures Prettier rules are enforced
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      'node/no-missing-import': 'error',
      'node/no-extraneous-import': 'error',
      'node/no-unpublished-import': 'error',
      'node/no-process-exit': 'error',
      strict: ['error', 'global'],
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-process-env': 'off',
      'prefer-const': 'error',
    },
  },
  {
    files: ['**/*'], // Apply rules to all files
    ignores: ['src/'], // Exclude the 'src' directory
    rules: {
      'node/no-unpublished-import': 'off',
    },
  },
  {
    files: ['src/**/*.js'],
    rules: {
      'node/no-extraneous-import': 'off', // NA. `src` contains a separate package.json.
    },
  },
];
