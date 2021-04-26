module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular/cli"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      //require('karma-phantomjs-launcher'),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular/cli/plugins/karma"),
      require("karma-scss-preprocessor"),
      require("karma-sonarqube-reporter"),
      require("karma-junit-reporter")
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    angularCli: {
      environment: "dev"
    },
    coverageIstanbulReporter: {
      dir: require("path").join(
        __dirname,
        "test-reports/vision-v2-CoverageResults"
      ),
      reports: ["html", "lcovonly", "text-summary", "cobertura"],
      fixWebpackSourcePaths: true
    },
    // sonarqubeReporter: {
    //   basePath: 'src/app',
    //   outputFolder: './',
    //   filePattern: '**/*spec.ts',
    //   encoding: 'utf-8',
    //   legacyMode: false,
    //   reportName: 'karma-report.xml'
    //   // (metadata) => {
    //   //   return metadata.concat('xml').join('.');
    //   // }
    // },
    // progressReporter:{
    //   outputFolder: './',
    //   // will be resolved to basePath (in the same way as files/exclude patterns)
    //   outputFile: './karma-report.xml'
    // },
    junitReporter: {
      useBrowserName: false,
      outputDir: require("path").join(
        __dirname,
        "test-reports/vision-v2-JunitResults"
      ),
      // will be resolved to basePath (in the same way as files/exclude patterns)
      outputFile: "karma-report.xml"
    },
    reporters: ["progress", "junit", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ["Chrome"],
    singleRun: true,
    captureTimeout: 4 * 60 * 1000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 4 * 60 * 1000,
    flags: ["--disable-web-security", "--disable-gpu", "--no-sandbox"]
  });
};
