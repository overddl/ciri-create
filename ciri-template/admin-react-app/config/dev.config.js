const webpack = require('webpack')
const path = require('path')
const config = require('./config')
const merge = require('webpack-merge')
const pkg = require('../package.json')

const baseWebpackConfig = require('./webpack.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: config.dev.ENV,
  devtool: config.dev.devtool,
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    contentBase: false, // use CopyWebpackPlugin.
    compress: true,
    host: config.dev.host,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxy,
    quiet: true, // for FriendlyErrorsPlugin
    watchOptions: {
      poll: false, // File watching using polling in Network File System (NFS) mode
    }
  },
  module: {
    rules: [
      {
        test: /\.(css|less)/,
        include: path.resolve(__dirname, '../src'),
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          }
        }]
      }, 
      {
        test: /\.(css|less)/,
        include: path.resolve(__dirname, '../node_modules'),
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'less-loader'
        }]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'React': 'react'
    }),
    new webpack.ContextReplacementPlugin(
      /moment[\\\/]locale$/,
      /^\.\/(zh-cn)$/
    ),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: pkg.description,
      template: path.resolve(__dirname, '../src/index.html'),
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${config.dev.host}:${config.dev.port}`],
        clearConsole: true
      }
    })
  ]
})

module.exports = devWebpackConfig