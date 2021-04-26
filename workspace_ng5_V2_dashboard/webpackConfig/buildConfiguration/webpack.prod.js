const commonConfig = require('./webpack.common.js');

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

// Webpack Plugins
const ModuleConcatenationPlugin = webpack.optimize.ModuleConcatenationPlugin;
const NoEmitOnErrorsPlugin = webpack.NoEmitOnErrorsPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DynamicPublicPathPlugin = require("./dynamic-public-path-webpack-plugin");
const MergeLocalizations = require("smart-localizations-merger");

module.exports = webpackMerge(commonConfig, {

  devtool: false,
  mode: 'production',

  entry: {
		'app': './webpackConfig/main.ts',
    'polyfills': './webpackConfig/polyfills.ts',
    'vendor':'./webpackConfig/vendors.ts'//,
    //'ss':'./src/styles/sc.scss'//,
     //'stylecss':'./src/styles/ss.css'
  },

  output: {
    path: root('../../../distribution/__buildVersion___dashboard__V2/minified/'),
    publicPath:"#__cdnPath#smartcontent/distribution/#{buildVersion}_dashboard__V2/minified/",
    filename: (chunkData) => {
      return chunkData.chunk.name === 'ie-polyfills' ? '[name].bundle.min.js': '[name].bundle.min.js';
    },
    chunkFilename: '[name].chunk.min.js'
  },

  module: {
    rules: [

      {
        'test': /\.(eot|svg|cur)$/,
        'loader': 'file-loader',
        'options': {
          'name': '[hash:20].bundle.min.[ext]',
          'outputPath': 'assets/'
        }
      },
      {
        'test': /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
        'loader': 'url-loader',
        'options': {
          'name': '[name:20].bundle.min.[ext]',
          'outputPath': 'assets/',
          'limit': 10000
        }
      },
      {
        test: /\.(css|sass|scss)$/,
        //exclude: /\sc.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: {
                safe: true
              },
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ],
         include: [root('src', 'styles')]
      },
      // {
      //   test: /\.(css|scss)$/,
      //   //exclude: /\sc.(css|scss)$/,
      //   loader: [
      //     MiniCssExtractPlugin.loader,
      //     'css-loader',
      //     'sass-loader'
      //   ],
      //    include: [root('src', 'styles')]
      // },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     'css-loader'//,
      //   //   {
      //   //     loader: 'postcss-loader',
      //   //     options: {
      //   //       plugins: () => [require('autoprefixer')],
      //   //       ident: 'postcss',
      //   //       sourceMap: 'inline'
      //   //     }
      //   //   }
      //    ],
      //    include: [root('src', 'styles')]
      // },
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loaders: ['@ngtools/webpack']
      },
      // {
      //   test: /\.js$/,
      //   loader: '@angular-devkit/build-optimizer/webpack-loader',
      //   options: {
      //     sourceMap: false
      //   }
      // }

    ]
  },
  performance: { hints: false },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
       maxAsyncRequests: Infinity,
       cacheGroups: {
        default: {
          chunks: 'async',
          minChunks: 2,
          priority: 10,
        },
        common: {
          name: 'common',
          chunks: 'async',
          minChunks: 2,
          enforce: true,
          priority: 5,
        },
        vendors: false,
        vendor: 'vendor',
      },
    },

    minimizer: [
      new TerserPlugin({
        sourceMap: false,
        parallel: true,
        cache: true,
        terserOptions: {
          warnings: false,
          safari10: true,
          output: {
            ascii_only: true,
            comments: false,
            webkit: true,
          },
          compress: {
            pure_getters: true,
            // PURE comments work best with 3 passes.
            // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
            passes: 3,
            global_defs: {
              ngDevMode: false,
            },
          }

        },
      })
    ],
  },

  plugins: [

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors
    new NoEmitOnErrorsPlugin(),

    new ProgressPlugin(),

    new OptimizeCssAssetsPlugin(),

    new AngularCompilerPlugin({
      'mainPath': './webpackConfig/main.ts',
      'tsConfigPath': './tsconfig.app.json'
    }),

    // Inject script and link tags into html files
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: './src/index.html',
      //excludeAssets: [/ie-polyfills.*.],
      chunksSortMode: function (a, b) {
        const order = ['polyfills', 'vendor', 'app'];
        return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
      }//,
    //  favicon: './src/favicon.ico'
    }),
    new HtmlWebpackExcludeAssetsPlugin(),
    // Extract css files
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].bundle.min.css'
    }),

    new ModuleConcatenationPlugin(),
  //   new BundleAnalyzerPlugin({
  //     analyzerMode: 'static'
  // })  
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
      outputPath: root('../../../distribution/__buildVersion___dashboard__V2/minified/locale_files_common'),
      documentName: ''
    }),
  ],
  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  },

  stats: {
    colors: true,
    hash: true,
    timings: true,
    chunkModules: false,
    modules: true,
    maxModules: 0,
    reasons: false,
    warnings: true,
    version: false,
    assets: true,
    chunks: false,
    children: false
  }
});

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
