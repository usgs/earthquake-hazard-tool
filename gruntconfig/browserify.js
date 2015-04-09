'use strict';

var config = require('./config');

// List individual modules here. Each listed module will be aliased in the
// "bundle", and will be set as an external in "test"s and "example"s.
var CWD = process.cwd(),
    EXPORTS = [];
var addExports = function (basedir, files) {
  files.forEach(function (f) {
    EXPORTS.push(CWD + '/' + basedir + '/' + f + '.js:' + f);
  });
};
// hazdev-webutils exports
addExports('node_modules/hazdev-webutils/src', [
  'util/Xhr'
]);
// project exports
addExports(config.src + '/htdocs/js', [
  'HazardCurve',
  'HazardCurveGraphView'
]);
// Subsequent source files can then require "Class" with:
// var Class = require('package/Class');

var CWD = process.cwd(),
    NODE_MODULES = CWD + '/node_modules';

var browerify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        CWD + '/' + config.src + '/htdocs/js',
        NODE_MODULES,
        NODE_MODULES + '/hazdev-tablist/src',
        NODE_MODULES + '/hazdev-webutils/src'
      ]
    }
  },


  // the bundle used by the index page
  index: {
    src: [config.src + '/htdocs/js/index.js'],
    dest: config.build + '/' + config.src + '/htdocs/js/index.js'
  },

  // the bundle used by tests
  bundle: {
    src: [],
    dest: config.build + '/' + config.src + '/htdocs/js/bundle.js',
    options: {
      alias: EXPORTS
    }
  },

  // the bundle of test suites
  test: {
    src: [config.test + '/js/test.js'],
    dest: config.build + '/' + config.test + '/js/test.js',
    options: {
      external: EXPORTS
    }
  }
};

module.exports = browerify;
