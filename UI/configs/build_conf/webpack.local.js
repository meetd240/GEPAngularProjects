const commonConfig = require('./webpack.common.js');
const webpackMerge = require('webpack-merge');
const path = require('path');

// Webpack Plugins
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const GenerateThemeStyles = require('smart-theme-styles-generator');

module.exports = webpackMerge(commonConfig, {
	output: {
    path: path.join(__dirname, '../../distribution/__buildVersion___reqng5/'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
},
  devtool: 'cheap-module-source-map',

  mode: 'development',

  entry: {
    'polyfills': './configs/polyfills.ts',
    'vendor':'./configs/vendors.ts',
    'app': './configs/main.ts',
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
				test: /\.(css|sass|scss)$/,
				use: [ 'to-string-loader',
					'css-loader',
					'smart-rtl-loader',
					'sass-loader'
				]
			},
      // {
      //   test:   /\.module\.js$/,
      //   loader: "...",
      //   query:  {
      //     context:   "<path to ngc generated root>",
      //     ngFactory: true
      //  }
      //  },
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
      mainPath: './configs/main.ts',
      tsConfigPath: './tsconfig.app.json',
      skipCodeGeneration: false
    }),
    new GenerateThemeStyles({
			outputPath: 'distribution/__buildVersion___reqng5/themeStyles/',
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
    overlay: true,
    writeToDisk: true
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
