'use strict'

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const path = require('path')

// This configuration is inspired by the one from create-react-app (after ejecting)
module.exports = function(proxy, allowedHost, host, protocol) {
  return {
    disableHostCheck: !proxy,
    // Enable gzip compression of generated files.
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: 'none',
    // Make sure everything webpack doesn't know of is proxied.
    contentBase: false,
    hot: true,
    publicPath: '/',
    quiet: true,
    watchOptions: {
      ignored: new RegExp(
        `^(?!${path.normalize('./src' + '/').replace(/[\\]+/g, '\\\\')}).+[\\\\/]node_modules[\\\\/]`,
        'g',
      ),
    },
    https: protocol === 'https',
    host: host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    public: allowedHost,
    proxy,
    before(app) {
      app.use(errorOverlayMiddleware())
      app.use(noopServiceWorkerMiddleware())
    },
  }
}
