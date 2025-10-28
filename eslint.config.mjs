import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.vitest,
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginJest.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-expressions": "warn",
      "no-implicit-coercion": "error",
      quotes: ["error", "double"],
      semi: ["warn", "always"],
    },
  },
  {
    ignores: ["node_modules"],
  },
  {
    settings: {
      react: {
        version: "detect",
      },
      jest: {
        version: "detect",
      },
    },
  },
];
