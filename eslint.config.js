// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslint from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';
import typeScriptEsLint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default typeScriptEsLint.config([
  globalIgnores(['dist']),
  // Turn off all the prettier rules that conflicts with Eslint..
  // ..keeping Eslint as linter and prettier as code formatter.
  eslintConfigPrettier,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      typeScriptEsLint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    ignores: [
      // We do not ever want to lint bundled files.
      'dist/**/*',

      // Recommended ignore by: https://www.npmjs.com/package/eslint-plugin-storybook
      '!.storybook',

      // Dependency cruiser may require special syntax.
      // We do not care it aligns with the rest of the codebase.
      '!.dependency-cruiser.cjs',
    ],
    rules: {
      'import/order': 'off',
      // https://stackoverflow.com/questions/60743389/eslint-defined-global-extensions-still-not-defined-no-undef
      'no-undef': 'off',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
], storybook.configs["flat/recommended"]);
