'use strict';

var gruntConfig = {

  browserify: require('./browserify'),
  clean: require('./clean'),
  connect: require('./connect'),
  copy: require('./copy'),
  jshint: require('./jshint'),
  makeReport: require('./istanbul'),
  mocha_phantomjs: require('./mocha_phantomjs'),
  postcss: require('./postcss'),
  uglify: require('./uglify'),
  watch: require('./watch'),

  tasks: [
    'grunt-browserify',
    'grunt-connect-proxy',
    'grunt-contrib-clean',
    'grunt-contrib-connect',
    'grunt-contrib-copy',
    'grunt-contrib-jshint',
    'grunt-contrib-uglify',
    'grunt-contrib-watch',
    'grunt-istanbul',
    'grunt-mocha-phantomjs',
    'grunt-postcss'
  ]
};

module.exports = gruntConfig;
