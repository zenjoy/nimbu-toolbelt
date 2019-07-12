const path = require('path')
const paths = require('./paths.js')
const webpack = require('webpack')
const projectConfig = require('./config')

const cssEntry = projectConfig.CSS_ENTRY != null ? projectConfig.CSS_ENTRY : 'index.scss'
const jsEntry = projectConfig.JS_ENTRY != null ? projectConfig.JS_ENTRY : 'index.js'

const config = {
  entry: {
    app: [
      path.resolve(paths.NIMBU_DIRECTORY, `src/${cssEntry}`),
      path.resolve(paths.NIMBU_DIRECTORY, `src/${jsEntry}`),
    ],
  },
  module: {
    strictExportPresence: true,
  },
  output: {
    filename: 'javascripts/[name].js',
    path: paths.NIMBU_DIRECTORY,
    publicPath: '/',
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
  resolve: {
    extensions: ['.js', '.coffee'],
  },
}

module.exports = config
