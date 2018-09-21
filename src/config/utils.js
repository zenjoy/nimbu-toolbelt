const autoprefixer = require('autoprefixer');
const _ = require('lodash');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./config');

function babelLoader() {
  const options = {
    cacheDirectory: true,
    presets: ["react-app"]
  }
  options.plugins = [
    ["babel-plugin-root-import", {
      "rootPathSuffix": "src"
    }]
  ];
  if(config.REACT) {
    options.plugins.push("react-hot-loader/babel")
  }
  return {
    loader: 'babel-loader',
    options
  }
}

function codeLoaders(options) {
  return [
    {
      test: /\.coffee$/,
      exclude: /node_modules/,
      use: [
        babelLoader(),
        'coffee-loader',
      ]
    },
    {
      test: /\.js$/,
      // exclude node modules, except our own polyfills
      exclude: /node_modules(?!.*nimbu-toolbelt\/polyfills\.js)/,
      use: [
        babelLoader(),
      ],
    }
  ]
}

const fileloader = require.resolve('file-loader');
const fileloaderOutputPath = (name) => {
  let basename = name.split('?h=')[0];
  return `${basename}`;
};

function fileLoaders(options = {}) {
  const loaders = [
    {
      loader: fileloader,
      test: [/\.(eot|otf|woff|woff2|ttf)(\?\S*)?$/, /fonts.*\.svg(\?\S*)?$/],
      options: {
        name: 'fonts/[name].[ext]?h=[hash:8]',
        publicPath: options.publicPath || '/',
        outputPath: fileloaderOutputPath,
      }
    },
    {
      loader: fileloader,
      // Exclude `js` files to keep "css" loader working as it injects
      // it's runtime that would otherwise processed through "file" loader.
      // Also exclude `html` and `json` extensions so they get processed
      // by webpacks internal loaders.
      exclude: [/\.js$/, /\.html$/, /\.json$/, /\.ejs$/],
      options: {
        name: 'images/[name].[ext]?h=[hash:8]',
        publicPath: options.publicPath || '/',
        outputPath: fileloaderOutputPath,
      },
    }
  ];
  if(config.REACT && config.SVG_LOADER_INCLUDE) {
    loaders.splice(0, 0, {
      test: /\.svg$/,
      include: config.SVG_LOADER_INCLUDE,
      use: [
        babelLoader(),
        require.resolve('./svg-loader.js'),
      ]
    })
  }
  return loaders;
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
            extractTextPluginOptions
          )
        ),
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      },
    ],
    plugins: [
      // extract css into its own file
      new ExtractTextPlugin({
        filename: 'stylesheets/[name].css'
      }),
      new CssoWebpackPlugin({
        restructure: false, // Merging rules sometimes behaves incorrectly.
      })
    ],
  }
}

function styleConfigWithoutExtraction(options) {
  return {
    loaders: [
      {
        test: /\.(css|scss)$/,
        use: [
          require.resolve('style-loader')
        ].concat(styleLoaders(options))
      }
    ],
    plugins: [],
  }
}

function styleConfig(options) {
  if(options.shouldExtractCSS) {
    return styleConfigWithExtraction(options);
  } else {
    return styleConfigWithoutExtraction(options);
  }
}

function htmlWebPackPlugins(entries, options = {}) {
  const template = require.resolve('../../template/webpack.liquid.ejs');
  return _.flatten(entries.map(function (name) {
    return [
      new HtmlWebpackPlugin({
        filename: `snippets/webpack.liquid`,
        template: template,
        alwaysWriteToDisk: options.alwaysWriteToDisk,
        inject: false,
        chunksSortMode: 'dependency',
      }),
    ]
  }));
}

module.exports = {
  styleLoaders,
  styleConfig,
  codeLoaders,
  fileLoaders,
  htmlWebPackPlugins
}
