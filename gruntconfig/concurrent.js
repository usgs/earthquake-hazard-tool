'use strict';

var concurrent = {
  dev: [
    'browserify:index',
    'browserify:bundle',
    'browserify:leaflet',
    'copy:dev',
    'copy:leaflet',
    'copy:locationview',
    'postcss:dev'
  ],

  dist: [
    'copy:dist',
    'uglify',
    'postcss:dist'
  ],

  test: [
    'browserify:test',
    'copy:test'
  ]
};

module.exports = concurrent;
