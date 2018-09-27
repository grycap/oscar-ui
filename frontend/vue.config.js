// vue.config.js
module.exports = {
  baseUrl: './',
  devServer: {
    proxy: {
      '/system': {
        target: 'http://gateway.openfaas:31112/',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
