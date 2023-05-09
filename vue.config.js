// vue.config.js
const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  publicPath: './',
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        "fs": false,
        "os": false,
        "path": false,
      }
    },
    plugins: [
      new NodePolyfillPlugin()
    ]
  },
}
