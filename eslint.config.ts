import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

const tsconfigRootDir = import.meta.dirname

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'playwright-report', 'test-results', 'ref'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        tsconfigRootDir,
      },
    },
    rules: {
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
      },
      parserOptions: {
        tsconfigRootDir,
      },
    },
  },
)
