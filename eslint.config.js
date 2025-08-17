import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly'
      },
      ecmaVersion: 12,
      sourceType: 'module'
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 0,
      '@typescript-eslint/no-explicit-any': 0,
      'react/no-unescaped-entities': 0,
      '@typescript-eslint/no-unused-expressions': 0
    },
    ignores: ['/node_modules', 'dist'],
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];