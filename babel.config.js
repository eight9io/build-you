module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      "transform-inline-environment-variables",
      "@babel/plugin-proposal-export-namespace-from",
      ["react-native-reanimated/plugin"],
      [
        "dotenv-import",
        {
          moduleName: "@env",
          path: ".env",
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: false,
        },
      ],
    ],
  };
};
