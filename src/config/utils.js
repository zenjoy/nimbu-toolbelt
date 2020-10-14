const autoprefixer = require('autoprefixer')
const _ = require('lodash')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssoWebpackPlugin = require('csso-webpack-plugin').default
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { get: getConfig } = require('./config')
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier')

let tsLoader

try {
  tsLoader = require.resolve('ts-loader')
} catch (err) {
  // ILB
}

function babelLoader(loaderOptions = {}) {
  const config = getConfig()
  const options = {
    cacheDirectory: true,
    cacheIdentifier: getCacheIdentifier(loaderOptions.cachePrefix || 'app-js', [
      'babel-plugin-named-asset-import',
      'babel-preset-react-app',
      'react-dev-utils',
      'react-scripts',
    ]),
    presets: ['react-app'],
  }
  options.plugins = [
    [
      'babel-plugin-root-import',
      {
        rootPathSuffix: 'src',
      },
    ],
  ]
  if (config.REACT) {
    options.plugins.push('react-hot-loader/babel')
  }
  return {
    loader: 'babel-loader',
    options,
  }
}

function codeLoaders(options) {
  const loaders = [
    {
      exclude: /node_modules/,
      test: /\.coffee$/,
      use: [babelLoader(options), 'coffee-loader'],
    },
    {
      // Application JS
      // exclude node modules, except our own polyfills
      exclude: /node_modules(?!.*nimbu-toolbelt\/polyfills\.js)/,
      test: /\.jsx?$/,
      use: [babelLoader(options)],
    },
    // Process any JS outside of the app with Babel.
    // Unlike the application JS, we only compile the standard ES features.
    {
      exclude: /@babel(?:\/|\\{1,2})runtime/,
      loader: require.resolve('babel-loader'),
      /* tslint:disable:object-literal-sort-keys */
      options: {
        babelrc: false,
        configFile: false,
        compact: false,
        presets: [[require.resolve('babel-preset-react-app/dependencies'), { helpers: true }]],
        cacheDirectory: true,
        // See create-react-app#6846 for context on why cacheCompression is disabled
        cacheCompression: false,
        cacheIdentifier: getCacheIdentifier(options.cachePrefix || 'non-app-js', [
          'babel-plugin-named-asset-import',
          'babel-preset-react-app',
          'react-dev-utils',
          'react-scripts',
        ]),
        // Babel sourcemaps are needed for debugging into node_modules
        // code.  Without the options below, debuggers like VSCode
        // show incorrect code and set breakpoints on the wrong lines.
        sourceMaps: options.shouldUseSourceMap,
        inputSourceMap: options.shouldUseSourceMap,
      },
      /* tslint:enable:object-literal-sort-keys */
      test: /\.(js|mjs)$/,
    },
  ]
  if (tsLoader != null) {
    loaders.push({
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: [babelLoader(options), tsLoader],
    })
  }
  return loaders
}

const fileloader = require.resolve('file-loader')
const fileloaderOutputPath = (name) => {
  let basename = name.split('?h=')[0]
  return `${basename}`
}

function fileLoaders(options = {}) {
  const config = getConfig()
  const loaders = [
    {
      loader: fileloader,
      options: {
        name: 'fonts/[name].[ext]?h=[hash:8]',
        outputPath: fileloaderOutputPath,
        publicPath: options.publicPath || '/',
      },
      test: [/\.(eot|otf|woff|woff2|ttf)(\?\S*)?$/, /fonts.*\.svg(\?\S*)?$/],
    },
    {
      // Exclude `js` files to keep "css" loader working as it injects
      // it's runtime that would otherwise processed through "file" loader.
      // Also exclude `html` and `json` extensions so they get processed
      // by webpacks internal loaders.
      exclude: [/\.js$/, /\.html$/, /\.json$/, /\.ejs$/],
      loader: fileloader,
      options: {
        name: 'images/[name].[ext]?h=[hash:8]',
        outputPath: fileloaderOutputPath,
        publicPath: options.publicPath || '/',
      },
    },
  ]
  if (config.REACT && config.SVG_LOADER_INCLUDE) {
    loaders.splice(0, 0, {
      include: config.SVG_LOADER_INCLUDE,
      test: /\.svg$/,
      use: [babelLoader(options), require.resolve('./svg-loader.js')],
    })
  }
  return loaders
}

function styleLoaders(options) {
  return [
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 2,
        minimize: false, // We use CssoWebpackPlugin later on
        sourceMap: options.shouldUseSourceMap,
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          autoprefixer({
            flexbox: 'no-2009',
          }),
        ],
      },
    },
    {
      loader: require.resolve('sass-loader'),
    },
  ]
}

const extractTextPluginOptions = {
  publicPath: '/stylesheets',
}

function styleConfigWithExtraction(options) {
  return {
    loaders: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: extractTextPluginOptions,
          },
        ].concat(styleLoaders(options)),
      },
    ],
    plugins: [
      // extract css into its own file
      new MiniCssExtractPlugin({
        filename: 'stylesheets/[name].css',
      }),
      new CssoWebpackPlugin({
        restructure: false, // Merging rules sometimes behaves incorrectly.
      }),
    ],
  }
}

function styleConfigWithoutExtraction(options) {
  return {
    loaders: [
      {
        test: /\.(css|scss)$/,
        use: [require.resolve('style-loader')].concat(styleLoaders(options)),
      },
    ],
    plugins: [],
  }
}

function styleConfig(options) {
  if (options.shouldExtractCSS) {
    return styleConfigWithExtraction(options)
  } else {
    return styleConfigWithoutExtraction(options)
  }
}

function htmlWebPackPlugins(entries, options = {}) {
  const template = require.resolve('../../template/webpack.liquid.ejs')
  return _.flatten(
    entries.map(function (name) {
      return [
        new HtmlWebpackPlugin({
          alwaysWriteToDisk: options.alwaysWriteToDisk,
          chunksSortMode: 'dependency',
          filename: `snippets/webpack.liquid`,
          inject: false,
          template: template,
        }),
      ]
    }),
  )
}

module.exports = {
  codeLoaders,
  fileLoaders,
  htmlWebPackPlugins,
  styleConfig,
  styleLoaders,
}
