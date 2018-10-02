// vue.config.js
module.exports = {
  baseUrl: './',
  devServer: {
    proxy: {
      '/system': {
        target: 'http://192.168.99.100:31112/',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
