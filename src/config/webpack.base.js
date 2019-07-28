const path = require('path')
const paths = require('./paths.js')
const webpack = require('webpack')
const projectConfig = require('./config')

const cssEntry = projectConfig.CSS_ENTRY != null ? projectConfig.CSS_ENTRY : 'index.scss'
const jsEntry = projectConfig.JS_ENTRY != null ? projectConfig.JS_ENTRY : 'index.js'

// the order for entries is important: first load javascript, next load the css - as you probably want to cascadingly override stuff from libraries
const config = {
  entry: {
    app: [
      path.resolve(paths.NIMBU_DIRECTORY, `src/${jsEntry}`),
      path.resolve(paths.NIMBU_DIRECTORY, `src/${cssEntry}`),
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
