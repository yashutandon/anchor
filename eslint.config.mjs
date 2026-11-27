import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/out/**",
      "**/coverage/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "packages/db/src/generated/**",
      "packages/db/.agents/**",
      "packages/db/.claude/**",
      "packages/db/.windsurf/**",
      "apps/demo-app/next-env.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{jsx,tsx}"],
    ...jsxA11y.flatConfigs.strict,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
);
