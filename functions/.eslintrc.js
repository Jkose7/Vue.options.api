module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "requireConfigFile": false,
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {
        "key-spacing": ["error", {"beforeColon": false, "afterColon": true}],
        "quotes": ["error", "double"],
        "comma-dangle": ["error", "always-multiline"],
        "object-curly-spacing": ["error", "never"],
        "indent": ["error", 2],
      },
    },
  ],
  globals: {},
};
