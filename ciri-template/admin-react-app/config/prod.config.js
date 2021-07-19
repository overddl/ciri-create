const path = require('path')
const webpack = require('webpack')
const config = require('./config')
const antConfig = require('./ant.config')
const merge = require('webpack-merge')
const pkg = require('../package.json')

const baseWebpackConfig = require('./webpack.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const assetsPath = (_path) => {
  const assetsSubDirectory = process.env.NODE_ENV === config.prod.ENV
    ? config.prod.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

const webpackConfig = merge(baseWebpackConfig, {
  mode: config.prod.ENV,
  devtool: false,
  output: {
    path: config.prod.assetsRoot,
    filename: assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: assetsPath('js/[name].[chunkhash].js')
  },
  module: {
    rules: [
      {
        test: /\.(css|less)/,
        include: path.resolve(__dirname, '../src'),
        use: [
          MiniCssExtractPlugin.loader, 
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
        ]
      }, 
      {
        test: /\.(css|less)/,
        include: path.resolve(__dirname, '../node_modules'),
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "less-loader",
            options: {
              modifyVars: antConfig,
              javascriptEnabled: true,
            },
          }
        ]
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
    new MiniCssExtractPlugin({
      filename: assetsPath('/css/[name].[hash].css'),
      chunkFilename: assetsPath('/css/[name].[hash].css'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: pkg.description,
      template: path.resolve(__dirname, '../src/index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.prod.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCSSAssetsPlugin()
    ],
    splitChunks: {
      chunks: 'all'
    }
  }
})

module.exports = webpackConfig