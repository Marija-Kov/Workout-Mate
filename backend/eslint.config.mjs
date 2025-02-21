import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"], 
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      }
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-expressions": "warn",
      "no-implicit-coercion": "error",
      "quotes": ["error", "double"],
      "semi": ["warn", "always"],
    }
  }
];