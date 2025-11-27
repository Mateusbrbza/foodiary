import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,

      'no-console': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-debugger': 'warn',
      'no-duplicate-case': 'error',
      'no-empty': 'warn',
      'no-extra-semi': 'warn',
      'no-func-assign': 'error',
      'no-irregular-whitespace': 'warn',
      'no-unreachable': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettier,
];
