'use strict';

module.exports = function (grunt) {

  var gruntConfig = require('./gruntconfig');


  // Load grunt tasks
  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntConfig);


  // creates distributable version of application
  grunt.registerTask('build', [
    'clean',
    'dev',
    'concurrent:dist' // uglify, copy:dist, cssmin
  ]);

  // default task useful during development
  grunt.registerTask('default', [
    'dev',
    'test',

    'configureProxies:dev',
    'connect:data',
    'connect:template',
    'connect:dev',

    'watch'
  ]);

  // builds development version of application
  grunt.registerTask('dev', [
    'jshint:dev',
    'concurrent:dev' // browserify:index, copy:dev, compass:dev
  ]);

  // starts distribution server and preview
  grunt.registerTask('dist', [
    'build',
    'configureProxies:dist',
    'connect:dist'
  ]);

  // runs tests against development version of library
  grunt.registerTask('test', [
    'jshint:test',
    'concurrent:test', // browserify:test, copy:test
    'connect:test',
    'mocha_phantomjs'
  ]);
};
