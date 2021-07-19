const path = require('path')
const pkg = require('../package.json')

module.exports = {
  prod: {
    ENV: 'production',
    assetsRoot: path.resolve(__dirname, `../dist.v${pkg.version}`),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/mob/',
  },
  dev: {
    ENV: 'development',
    host: 'localhost',
    port: '8081',
    autoOpenBrowser: true,
    devtool: 'cheap-module-eval-source-map',
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxy: {
      '/api': {
        "pathRewrite": {'^/api' : '/api'},
        "target": "localhost:8080",
        "changeOrigin": true
      }
    }
  }
}