// root() is defined at the bottom
const path = require("path");
const webpack = require("webpack");
const rxPaths = require("rxjs/_esm5/path-mapping");
// Webpack Plugins
//const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const GenerateThemeStyles = require("smart-theme-styles-generator");
const fs = require("fs");
// const CsvToJson = require("./csvToJson");
var tsconfig = require("../../tsconfig.app.json");
if (process.env.ENV != null) {
  environment = process.env.ENV;
} else environment = "DEV";

module.exports = (function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  let config = {};
  getPathAlias = function() {
    var path = {};
    for (var _objectKey in tsconfig.compilerOptions.paths) {
      var pathKey = _objectKey;
      var pathValue = tsconfig.compilerOptions.paths[_objectKey].toString();
      if (pathValue.indexOf("/*") != -1) {
        pathKey = pathKey.substring(0, pathKey.length - 2);
        pathValue = pathValue.substring(0, pathValue.length - 2);
      }
      path[pathKey] = pathValue;
    }
    console.log("<================ Reading the Alias Name ================>");
    return Object.assign(path, rxPaths());
  };
  /**
   * Resolve
   * Reference: http://webpack.github.io/docs/configuration.html#resolve
   */
  config.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true,
          output: {
            comments: false,
            beautify: true
          }
        },
        sourceMap: true
      })
    ]
  };

  config.resolve = {
    modules: [__dirname, "src", "node_modules"],
    // only discover files that have those extensions
    extensions: [".ts", ".js"],
    alias: this.getPathAlias()
  };

  config.module = {
    rules: [
      // {
      //   test: /\.scss$/,
      //   use: [
      //     'to-string-loader',
      //     'css-loader',
      //     // {
      //     //   loader: 'postcss-loader',
      //     //   options: {
      //     //     plugins: () => [require('autoprefixer')],
      //     //     ident: 'postcss',
      //     //     sourceMap: 'inline',
      //     //   },
      //     // },
      //   ]//,
      //   //exclude: [root('src', 'styles')],
      // },
      {
        test: /\.(css|sass|scss)$/,
        use: ["to-string-loader", "css-loader", "sass-loader"],
        exclude: [root("src", "styles")]
      },
      // Support for *.json files.
      { test: /\.json$/, loader: "json-loader" },
      // support for .html as raw text
      { test: /\.html$/, loader: "raw-loader" },
      {
        // Remove this when Angular drop System.import()
        test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
        parser: { system: true }
      }
    ]
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
          from: "src/assets",
          to: "assets/[path][name].[ext]",
          toType: "template"
        }
      ],
      {
        ignore: [".gitkeep"],
        debug: "warning"
      }
    ),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(process.env.NODE_ENV === "production"),
      BUILDTIMESTAMP: JSON.stringify(Date.now())
    }),

    new CopyWebpackPlugin(
      [
        {
          from: "src/assets/css/common.css",
          to: "css/common.css"
        },
        {
          from: "src/assets/css/smart.css",
          to: "css/smart.css"
        },
        {
          from: "config.js",
          to: "config.js"
        },
        {
          from: "powerbi.js",
          to: "powerbi.js"
        },
        {
          from: "src/assets/third-party/gridstack/gridstackLib.js",
          to: "gridstackLib.js"
        },
        {
          from: "src/assets/third-party/gridstack/gridstack.css",
          to: "css/gridstack.css"
        },
        {
          from: "src/assets/third-party/gridstack/gridstack-extra.css",
          to: "css/gridstack-extra.css"
        },
        {
          from: "src/assets/third-party/gridstack/gridstackLib.js",
          to: "gridstackLib.js"
        },
        {
          from: "src/mockData/mockData.js",
          to: "mockData.js"
        },
        {
          from: "src/assets/svg/icons-svg.js",
          to: "svg/icons-svg.js"
        },
        {
          from: "src/index.html",
          to: "index.html"
        },
        {
          from: "src/assets/svg/resources.js",
          to: "svg/resources.js"
        },
        {
          from: "src/assets/third-party/dashboard/dashboardLib.js",
          to: "dashboardLib.js"
        },
        {
          from: "src/assets/third-party/ion-slider",
          to: "css"
        },
        {
          from: "node_modules/smart-assets/smart-theme/ie11var.js",
          to: "ie11var.js"
        }
      ],
      {
        debug: "silent"
      }
    ),
    new GenerateThemeStyles(getCustomThemeStylePath())
    // new CsvToJson({
    //   path: "locale_csv_files/client_locale_files",
    //   outputPath: root(
    //     "../../../distribution/__buildVersion___dashboard__V2/locale_files"
    //   )
    // }),
    // new CsvToJson({
    //   //This is an centralized path for localization.
    //   excludeFiles: ["index", "package", "tsconfig"],
    //   path: "node_modules/smart-localization/src",
    //   outputPath: root(
    //     "../../../distribution/__buildVersion___dashboard__V2/locale_files_common"
    //   )
    // })
    // new CsvToJson({
    //   path: "locale_csv_files/test_local",
    //   outputPath: root(
    //     "../../../distribution/__buildVersion___dashboard__V2/test_local"
    //   )
    // }),
    // new CsvToJson({
    //   path: "locale_csv_files/Localization_Files",
    //   outputPath: root(
    //     "../../../distribution/__buildVersion___dashboard__V2/Localization_Files"
    //   )
    // })
  ];

  return config;
})();

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function getCustomThemeStylePath() {
  var path = root(
    "../../../distribution/__buildVersion___dashboard__V2/themeStyles/"
  );
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true }, e => {
      e
        ? console.log("Error Occured During Path Creation ")
        : console.log("Successfully Created Path !!!");
    });
  }
  return {
    inputPath: "node_modules",
    outputPath: path
  };
}
