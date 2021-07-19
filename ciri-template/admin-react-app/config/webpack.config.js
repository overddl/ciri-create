const path = require('path')
const config = require('./config')

const resolve = (dir) => path.join(__dirname, '..', dir)

const assetsPath = (_path) => {
  const assetsSubDirectory = process.env.NODE_ENV === config.prod.ENV
    ? config.prod.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/index.js',
  },
  output: {
    path: config.prod.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === config.prod.ENV
      ? config.prod.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        use: 'babel-loader',
        include: resolve('src')
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        },
        exclude: [resolve('src/assets/icon-svg')]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}