const commonConfig = require('./webpack.common.js');
const webpackMerge = require('webpack-merge');
const path = require('path');

// Webpack Plugins
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const DynamicPublicPathPlugin = require("./dynamic-public-path-webpack-plugin");
const MergeLocalizations = require("smart-localizations-merger");

module.exports = webpackMerge(commonConfig, {
	output: {
    path: root('../../../distribution/__buildVersion___dashboard__V2/non-minified/'),
    publicPath:"#__cdnPath#smartcontent/distribution/#{buildVersion}_dashboard__V2/non-minified/",
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
},
  devtool: 'cheap-module-source-map',

  mode: 'development',

  entry: {
    'app': './webpackConfig/main.ts',
    'polyfills': './webpackConfig/polyfills.ts',
    'vendor':'./webpackConfig/vendors.ts'//,
  },

  // output: {
  //   filename: 'js/[name].bundle.js'
  // },


  module: {
    rules: [

      {
        'test': /\.(eot|svg|cur)$/,
        'loader': 'file-loader',
        'options': {
          'name': '[hash:20].bundle.[ext]'
        }
      },
      {
        'test': /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
        'loader': 'url-loader',
        'options': {
          'name': '[hash:20].bundle.[ext]',
          'limit': 10000
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
              ident: 'postcss',
              sourceMap: 'inline'
            }
          }],
        include: [root('src', 'styles')]
      },
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loaders: ['@ngtools/webpack']
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          enforce: true
        }
      }
    },
    minimize: false
  },

  plugins: [


    new AngularCompilerPlugin({
      mainPath: './webpackConfig/main.ts',
      tsConfigPath: './tsconfig.app.json',
      skipCodeGeneration: false
    }),


    // // Inject script and link tags into html files
    // // Reference: https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: './src/index.html',
      excludeAssets: [/ie-polyfills.*.js/],
      chunksSortMode: function (a, b) {
        const order = ['polyfills', 'vendor', 'app'];
        return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
      }//,
     // favicon: './src/favicon.ico'
    }),
    new DynamicPublicPathPlugin({
      externalGlobal: 'window.__cdnPath', //Your global variable name.
      chunkName: [] // Chunk name from "entry".
    }),
    new MergeLocalizations({
      inputPaths: {
        platform: 'node_modules', //  this will look up all folders starting with 'smart-'
        document: root('../../../locale_csv_files/analytics'),
        clients: ''
      },
      outputPath: root('../../../distribution/__buildVersion___dashboard__V2/non-minified/locale_files_common'),
      documentName: ''
    }),
   // new HtmlWebpackExcludeAssetsPlugin()
  ],

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  devServer: {
    historyApiFallback: true,
    stats: {
      colors: true,
      hash: true,
      timings: true,
      chunks: false,
      chunkModules: false,
      children: false, // listing all children is very noisy in AOT and hides warnings/errors
      modules: true,
      maxModules: 0,
      reasons: false,
      warnings: true,
      assets: false, // listing all assets is very noisy when using assets directories
      version: false
    }, // none (or false), errors-only, minimal, normal (or true) and verbose,
    watchOptions: {aggregateTimeout: 300, poll: 1000},
    open: true,
    overlay: true
  },


  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}