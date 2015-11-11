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
    'copy:dist',
    'uglify',
    'postcss:dist',
  ]);

  // default task useful during development
  grunt.registerTask('default', [
    'clean',
    'dev',
    // test
    'jshint:test',
    'browserify:test',
    'copy:test',
    'connect:test',
    'mocha_phantomjs',
    // start server
    'configureProxies:dev',
    'connect:data',
    'connect:template',
    'connect:dev',
    'connect:example',

    'watch'
  ]);

  // builds development version of application
  grunt.registerTask('dev', [
    'jshint:dev',
    'browserify:index',
    'browserify:bundle',
    'browserify:leaflet',
    'copy:dev',
    'copy:leaflet',
    'copy:locationview',
    'postcss:dev',
  ]);

  // starts distribution server and preview
  grunt.registerTask('dist', [
    'build',
    'configureProxies:dist',
    'connect:template',
    'connect:dist:keepalive'
  ]);

  // runs tests against development version of library
  grunt.registerTask('test', [
    'dev',
    'jshint:test',
    'browserify:test',
    'copy:test',
    'connect:test',
    'mocha_phantomjs'
  ]);
};
