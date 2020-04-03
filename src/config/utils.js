const autoprefixer = require('autoprefixer')
const _ = require('lodash')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CssoWebpackPlugin = require('csso-webpack-plugin').default
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./config')

let tsLoader

try {
  tsLoader = require.resolve('ts-loader')
} catch (err) {
  // ILB
}

function babelLoader() {
  const options = {
    cacheDirectory: true,
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
      use: [babelLoader(), 'coffee-loader'],
    },
    {
      // exclude node modules, except our own polyfills
      exclude: /node_modules(?!.*nimbu-toolbelt\/polyfills\.js)/,
      test: /\.jsx?$/,
      use: [babelLoader()],
    },
  ]
  if (tsLoader != null) {
    loaders.push({
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: [babelLoader(), tsLoader],
    })
  }
  return loaders
}

const fileloader = require.resolve('file-loader')
const fileloaderOutputPath = name => {
  let basename = name.split('?h=')[0]
  return `${basename}`
}

function fileLoaders(options = {}) {
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
      use: [babelLoader(), require.resolve('./svg-loader.js')],
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
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: {
                loader: require.resolve('style-loader'),
                options: {
                  hmr: false,
                },
              },
              use: styleLoaders(options),
            },
            extractTextPluginOptions,
          ),
        ),
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
        test: /\.(css|scss)$/,
      },
    ],
    plugins: [
      // extract css into its own file
      new ExtractTextPlugin({
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
    entries.map(function(name) {
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
