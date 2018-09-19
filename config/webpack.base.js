const path = require('path');
const paths = require('./paths.js');
const webpack = require('webpack');

const config = {
  entry: {
    app: [
      path.resolve(paths.PROJECT_DIRECTORY, 'src/index.scss'),
      path.resolve(paths.PROJECT_DIRECTORY, 'src/index.js'),
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
