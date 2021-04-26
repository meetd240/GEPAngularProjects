// root() is defined at the bottom
const path = require('path');
const webpack = require('webpack');
const rxPaths = require('rxjs/_esm5/path-mapping');
// Webpack Plugins
//const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GenerateThemeStyles = require('smart-theme-styles-generator');
const MergeLocalizations = require('smart-localizations-merger');

if (process.env.ENV != null) {
	environment = process.env.ENV;
} else environment = 'DEV';

module.exports = (function makeWebpackConfig() {
	/**
	 * Config
	 * Reference: http://webpack.github.io/docs/configuration.html
	 * This is the object where all configuration gets set
	 */
	let config = {};

	/**
	 * Resolve
	 * Reference: http://webpack.github.io/docs/configuration.html#resolve
	 */
	config.resolve = {
		// only discover files that have those extensions
		extensions: ['.ts', '.js'],

    alias: Object.assign(
      {
        '@sharedModule': path.resolve(__dirname, '../../src', 'shared'),
        '@sharedServices': path.resolve(__dirname, '../../src', 'core/services'),
        '@interfaces': path.resolve(__dirname, '../../src', 'modules/interfaces'),
        '@sharedEnums': path.resolve(__dirname, '../../src', 'modules/enums')
      },
      rxPaths(),
    ),
  };

  config.module = {
    rules: [
    //   {
    //    test: /\.(css|sass|scss)$/,
    //    use: [
    //       'to-string-loader',
    //      'css-loader',
    //      'sass-loader'
    //    ],
    //     exclude: [root('src', 'styles')],
    //  },
      // Support for *.json files.
      { test: /\.json$/, loader: 'json-loader' },
      // support for .html as raw text
      { test: /\.html$/, loader: 'raw-loader' },
      {
        // Remove this when Angular drop System.import()
        test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
        parser: { system: true },
      },
    ],
  };

	/**
	 * Plugins
	 * Reference: http://webpack.github.io/docs/configuration.html#plugins
	 * List: http://webpack.github.io/docs/list-of-plugins.html
	 */
	config.plugins = [
		new CopyWebpackPlugin(
			[
        {
					from: 'src/assets',
					to: 'assets/[path][name].[ext]',
					toType: 'template',
        },
        {
          from: 'node_modules/smart-assets/smart-theme/ie11var.js',
          to: 'ie11var.js'
        },
				{
					from: 'distribution/__buildVersion___reqng5/locale_files',
					to: 'locale_files/[path][name].[ext]',
					toType: 'template'
				}
      ], 
      {
				ignore: ['.gitkeep'],
				debug: 'warning',
			},
		),
		new webpack.DefinePlugin({
			PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
			BUILDTIMESTAMP: JSON.stringify(Date.now()),
		}),
    new CopyWebpackPlugin([
      // { from: 'src/assets/css/common.css', to: 'css/common.css' },
      // { from: 'src/assets/css/smart.css', to: 'css/smart.css' },
      { from: 'config.js', to: 'config.js' },
      { from: 'src/modules/rules/gridRules.js', to: 'rules/gridRules.js' },
      { from: 'src/modules/rules/rules.js', to: 'rules/rules.js' },
      { from: 'mockData.js', to: 'mockData.js' },
      { from: 'src/assets/svg/icons-svg.js', to: 'svg/icons-svg.js' },
  ], { debug: 'debug' }),
    new MergeLocalizations({
      inputPaths: { 
        platform: 'node_modules',
        document: 'locale_csv_files/common',
        clients: 'locale_csv_files/clients'
      },
      outputPath: 'distribution/__buildVersion___reqng5/locale_files',
      documentName: 'req'
    })
	];
	return config;
})();

// Helper functions
function root(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return path.join.apply(path, [__dirname].concat(args));
}
