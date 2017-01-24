'use strict';

var config = require('./config');

var copy = {
  dev: {
    cwd: config.src,
    dest: config.build + '/' + config.src,
    expand: true,
    src: [
      '**/*',
      '!**/*.scss',
      '!**/*.js'
    ]
  },

  dist: {
    cwd: config.build + '/' + config.src,
    dest: config.dist,
    expand: true,
    src: [
      '!**/*.js',
      '!**/*.css',

      'conf/config.inc.php',
      'conf/config.ini',

      'htdocs/css/images/**/*',
      'htdocs/images/**/*',
      'htdocs/lib/**/*',
      'htdocs/*.html',
      'htdocs/*.php',

      'lib/**/*'
    ]
  },

  test: {
    cwd: config.test,
    dest: config.build + '/' + config.test,
    expand: true,
    src: [
      'test.html'
    ]
  },

  leaflet: {
    expand: true,
    cwd: 'node_modules/leaflet/dist',
    dest: config.build + '/' + config.src + '/htdocs/lib/leaflet',
    src: [
      'leaflet.js',
      'leaflet.css',
      'images/**'
    ]
  },

  locationview: {
    expand: true,
    cwd: 'node_modules/hazdev-location-view/src/locationview',
    dest: config.build + '/' + config.src + '/htdocs/css',
    src: [
      'images/point-control-cursor.cur',
      'images/location-control-icons.png'
    ]
  }

};

module.exports = copy;
