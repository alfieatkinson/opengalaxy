import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Resolve file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Compatibility setup for ESLint
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Define the base configuration (for Next.js and TypeScript)
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Add Prettier and ESLint's recommended settings
  "plugin:prettier/recommended", // This includes the eslint-plugin-prettier and configures Prettier as an ESLint rule
];

// Custom rules (if needed)
eslintConfig.push({
  rules: {
    "prettier/prettier": ["error"], // Enforce Prettier formatting
  },
});

export default eslintConfig;
