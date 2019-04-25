const path = require('path');
const paths = require('./paths.js');
const webpack = require('webpack');
const projectConfig = require('./config');

const cssEntry = projectConfig.CSS_ENTRY != null ? projectConfig.CSS_ENTRY : 'index.scss';
const jsEntry = projectConfig.JS_ENTRY != null ? projectConfig.JS_ENTRY : 'index.js';

const config = {
  entry: {
    app: [
      path.resolve(paths.NIMBU_DIRECTORY, `src/${cssEntry}`),
      path.resolve(paths.NIMBU_DIRECTORY, `src/${jsEntry}`),
    ],
  },
  output: {
    path: paths.NIMBU_DIRECTORY,
    filename: 'javascripts/[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.coffee'],
  },
  module: {
    strictExportPresence: true,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
};

module.exports = config;
