const path = require('path');
const paths = require('./paths.js');
const webpack = require('webpack');
const projectConfig = require('./config');

const cssEntry = projectConfig.CSS_ENTRY != null ? projectConfig.CSS_ENTRY : 'index.scss';
const jsEntry = projectConfig.JS_ENTRY != null ? projectConfig.JS_ENTRY : 'index.js';

const config = {
  entry: {
    app: [
      path.resolve(paths.PROJECT_DIRECTORY, `src/${cssEntry}`),
      path.resolve(paths.PROJECT_DIRECTORY, `src/${jsEntry}`),
    ],
  },
  output: {
    path: paths.PROJECT_DIRECTORY,
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};

module.exports = config;
