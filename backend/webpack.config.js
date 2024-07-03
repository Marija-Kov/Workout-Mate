const nodeExternals = require("webpack-node-externals");
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  target: "node",
  externals: [nodeExternals()],
  entry: "./src/server.js",
  output: {
    filename: "main.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new NodePolyfillPlugin()],
  mode: "production",
  module: {
    rules: [
      {
        exclude: [
          /node_modules/,
          path.resolve(__dirname, "src/controllers/__tests__"),
          path.resolve(__dirname, "src/controllers/test-utils"),
        ],
      },
    ],
  },
};
