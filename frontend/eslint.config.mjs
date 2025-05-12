import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import prettierConfig from './prettier.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores(['**/node_modules', '**/.next', '**/public', '**/build']),
  {
    extends: compat.extends('next/typescript', 'plugin:prettier/recommended'),

    plugins: {
      prettier,
    },

    rules: {
      'prettier/prettier': ['warn', prettierConfig],
    },
  },
])
