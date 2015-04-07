'use strict';

var config = require('./config');

var watch = {
  resources: {
    files: [
      config.src + '/**/*',
      '!' + config.src + '/**/*.scss',
      '!' + config.src + '/**/*.js'
    ],
    tasks: [
      'copy:build'
    ]
  },

  compass: {
    files: [
      config.src + '/htdocs/**/*.scss'
    ],
    tasks: [
      'compass:build'
    ]
  },

  scripts: {
    files: [
      config.src + '/htdocs/**/*.js'
    ],
    tasks: [
      'jshint:scripts',
      'browserify:index',
      'browserify:data',
    ]
  },

  gruntfile: {
    files: [
      'Gruntfile.js',
      'gruntconfig/**/*.js'
    ],
    tasks: [
      'jshint:gruntfile'
    ]
  },

  livereload: {
    options: {
      livereload: config.liveReloadPort
    },
    files: [
      config.build + '/' + config.src + '/htdocs/**/*'
    ]
  }
};

module.exports = watch;
