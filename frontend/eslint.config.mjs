import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import prettier from 'eslint-plugin-prettier'

// Resolve file paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Compatibility setup for ESLint
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// Manually import and extend configurations
export default {
  // Spread each individual config object
  ...compat.extends('next/core-web-vitals')[0],
  ...compat.extends('next/typescript')[0],
  ...compat.extends('plugin:prettier/recommended')[0],
  plugins: {
    prettier,
  },
  rules: {
    'prettier/prettier': ['error'], // Enforce Prettier formatting as error
  },
  ignores: [
    'node_modules',
    '.next',
    'public',
    'build',
    'out',
    'package-lock.json',
    'Dockerfile',
    'next.config.js',
    'postcss.config.js',
    'next-env.d.ts',
    'eslint.config.mjs',
    'tsconfig.json',
  ],
}
