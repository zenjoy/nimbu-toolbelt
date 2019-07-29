const merge = require('webpack-merge')
const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.js')
const utils = require('./utils')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const config = require('./config')

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
const shouldExtractCSS = process.env.EXTRACT_CSS === 'true'

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  let extras = [require.resolve('webpack-dev-server/client') + '?/', require.resolve('webpack/hot/dev-server')]
  if (config.REACT) {
    extras.splice(0, 0, require.resolve('core-js/modules/es6.symbol'))
  }
  baseWebpackConfig.entry[name] = extras.concat(baseWebpackConfig.entry[name])
})

const styleConfig = utils.styleConfig({ shouldUseSourceMap, shouldExtractCSS })

const loaders = utils
  .codeLoaders()
  .concat(styleConfig.loaders)
  .concat(utils.fileLoaders())

const webpackConfig = merge(baseWebpackConfig, {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        oneOf: loaders,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: 'true',
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    ...styleConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
    ...utils.htmlWebPackPlugins(Object.keys(baseWebpackConfig.entry), { alwaysWriteToDisk: true }),
    new HtmlWebpackHarddiskPlugin(),
  ],
})

module.exports = webpackConfig
