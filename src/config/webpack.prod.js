const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.js')
const utils = require('./utils')
const config = require('./config')

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
const shouldExtractCSS = true

const styleConfig = utils.styleConfig({ shouldUseSourceMap, shouldExtractCSS })

const loaders = utils
  .codeLoaders({
    shouldUseSourceMap,
    cachePrefix: 'production',
  })
  .concat(styleConfig.loaders)
  .concat(
    utils.fileLoaders({
      publicPath: config.CDN_ROOT || '../',
      cachePrefix: 'production',
    }),
  )

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        oneOf: loaders,
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: shouldUseSourceMap,
        uglifyOptions: {
          compress: {
            comparisons: false,
            drop_console: true,
          },
          mangle: true,
          output: {
            ascii_only: true,
            comments: false,
          },
          warnings: false,
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        polyfills: {
          chunks: 'all',
          name: 'polyfills',
          test: function (module) {
            // This prevents stylesheet resources with the .css or .scss extension
            // from being moved from their original chunk to the vendor chunk
            if (module.resource && /^.*\.(css|scss)$/.test(module.resource)) {
              return false
            }
            return (
              module.context &&
              (module.context.includes('node_modules/core-js') ||
                module.context.includes('node_modules/regenerator-runtime'))
            )
          },
        },
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: function (module) {
            // This prevents stylesheet resources with the .css or .scss extension
            // from being moved from their original chunk to the vendor chunk
            if (module.resource && /^.*\.(css|scss)$/.test(module.resource)) {
              return false
            }
            return (
              module.context &&
              (module.context.includes('node_modules') || module.context.includes('src/vendor')) &&
              !(
                module.context.includes('node_modules/core-js') ||
                module.context.includes('node_modules/regenerator-runtime')
              )
            )
          },
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: 'false',
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    ...styleConfig.plugins,
    ...utils.htmlWebPackPlugins(Object.keys(baseWebpackConfig.entry)),
  ],
})

module.exports = webpackConfig
