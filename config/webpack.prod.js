const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.js');
const utils = require('./utils');
const config = require('./config');

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const shouldExtractCSS = true;

const styleConfig = utils.styleConfig({ shouldUseSourceMap, shouldExtractCSS });

const loaders = utils.codeLoaders().concat(styleConfig.loaders).concat(
  utils.fileLoaders({
    publicPath: config.CDN_ROOT || '../',
  })
);

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        oneOf: loaders
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
        drop_console: true,
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
      sourceMap: shouldUseSourceMap,
    }),
    ...styleConfig.plugins,
    ...utils.htmlWebPackPlugins(Object.keys(baseWebpackConfig.entry)),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: function (module) {
        // This prevents stylesheet resources with the .css or .scss extension
        // from being moved from their original chunk to the vendor chunk
        if(module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        }
        return module.context && (module.context.includes("node_modules") || module.context.includes('src/vendor'));
      }
    })
  ]
});

module.exports = webpackConfig;
