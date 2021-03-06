const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const getBaseWebpackConfig = require('./webpack.base.js')
const utils = require('./utils')
const { get: getConfig } = require('./config')

const webpackConfig = () => {
  const config = getConfig()
  const baseWebpackConfig = getBaseWebpackConfig()
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
  const shouldExtractCSS = true

  const styleConfig = utils.styleConfig({ shouldUseSourceMap, shouldExtractCSS })

  const loaders = utils
    .codeLoaders({
      cachePrefix: 'production',
      shouldUseSourceMap,
    })
    .concat(styleConfig.loaders)
    .concat(
      utils.fileLoaders({
        cachePrefix: 'production',
        publicPath: config.CDN_ROOT || '../',
      }),
    )
  return merge(baseWebpackConfig, {
    devtool: shouldUseSourceMap ? 'source-map' : undefined,
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
      removeEmptyChunks: true,
      splitChunks: {
        cacheGroups: {
          polyfills: {
            chunks: 'initial',
            name: 'polyfills',
            priority: 10,
            test: function (module) {
              return (
                /css/.test(module.type) === false &&
                module.context &&
                (module.context.includes('node_modules/core-js') ||
                  module.context.includes('node_modules/regenerator-runtime'))
              )
            },
          },
          vendor: {
            chunks: 'initial',
            name: 'vendor',
            priority: 0,
            test: function (module) {
              return (
                /css/.test(module.type) === false &&
                module.context &&
                (module.context.includes('node_modules') || module.context.includes('src/vendor'))
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
}

module.exports = webpackConfig
