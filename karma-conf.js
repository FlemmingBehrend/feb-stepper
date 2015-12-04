module.exports = function (config) {
    config.set({
        basePath: '',
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'stepper.js',
            'stepper.spec.js'
        ],

        reporters: ['progress'],

        port: 9876,
        colors: true,

        logLevel: config.LOG_INFO,

        browsers: ['Firefox'],

        frameworks: ['jasmine'],

        captureTimeout: 60000,

        autoWatch: true,
        singleRun: false
    });

};