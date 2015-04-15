'use strict';

var concurrent = {
  dev: [
    'browserify:index',
    'browserify:bundle',
    'browserify:leaflet',
    'copy:dev',
    'copy:leaflet',
    'copy:locationview',
    'compass:dev'
  ],

  dist: [
    'copy:dist',
    'uglify',
    'cssmin'
  ],

  test: [
    'browserify:test',
    'copy:test'
  ]
};

module.exports = concurrent;
