import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: globals.browser } },
  {
    ignores: ["webpack.config.js", "dist"],
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];
