module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    //frameworks: ['jasmine', '@angular/cli','browserify'],
  //   files: [
  //     'src/app/**/*.ts',
  //     'src/spec/**/*-scost.specs.ts'
  // ],
    // files: ['../config.js'],
    files:['../src/**/*.spec.ts'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      //require('karma-phantomjs-launcher'),
     // require('karma-coverage'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma'),
      require('karma-scss-preprocessor'),
      require('karma-sonarqube-reporter'),
      require('karma-junit-reporter')
     // require('browserify')
    ],
  //   preprocessors: { '**/src/app/*-scost.spec.ts': ['coverage']
  // },
  //   preprocessors: {
  //     'test/**/*.js': [ 'browserify' ]
  //  },
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    angularCli: {
      environment: 'dev'
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcov', 'cobertura' ],
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
    mime: {
      "text/x-typescript": ["ts"]
    },
    junitReporter:{
      useBrowserName: false, 
      outputDir: 'report',
      // will be resolved to basePath (in the same way as files/exclude patterns)
      outputFile: 'karma-report.xml'
    },
    reporters: ['progress', 'kjhtml'],
    //reporters: ['progress', 'kjhtml','coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000,
    autoWatchBatchDelay: 300,
    flags: [
      '--disable-web-security',
      '--disable-gpu',
      '--no-sandbox'
    ]
    // browserify: {
    //   debug: true,
    //   transform: [ 'brfs' ]
    // }
  });
};
