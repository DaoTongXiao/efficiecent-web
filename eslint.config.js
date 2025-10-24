import * as tsEslint from 'typescript-eslint'
import eslint from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsdoc from 'eslint-plugin-jsdoc'
import react from 'eslint-plugin-react'
/**
 * eslint config
 */
export default tsEslint.config(
  {
    ignores: [
      'dist',
      'public',
      '.vscode',
      'node_modules'
    ]
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  jsdoc.configs['flat/contents-typescript-error'],
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsEslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      jsdoc
    },
    languageOptions: {
      globals: {
        ...globals.es2015,
        ...globals.browser,
        ...globals.node
      },
      parser: tsEslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          tsx: true
        }
      }
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description'
      }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'args': 'all',
          'argsIgnorePattern': '^_',
          'caughtErrors': 'all',
          'caughtErrorsIgnorePattern': '^_',
          'destructuredArrayIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'ignoreRestSiblings': true
        }
      ],
      'no-unused-vars': [
        'error',
        {
          'args': 'none',
          'argsIgnorePattern': '^_',
          'caughtErrors': 'all',
          'caughtErrorsIgnorePattern': '^_',
          'destructuredArrayIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'ignoreRestSiblings': true
        }
      ],
      'comma-dangle': ['error', 'never'],
      'jsdoc/check-alignment': 'warn',
      'jsdoc/informative-docs': 'off',
      'jsdoc/match-description': 'off'
    }
  }
)