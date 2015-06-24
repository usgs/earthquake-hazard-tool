'use strict';

var config = require('./config');

var CWD = process.cwd(),
    EXPORTS = [],
    NODE_MODULES = CWD + '/node_modules';


/**
 * Utility function for managing EXPORTS array.
 *
 * @param basedir {String}
 *        export base directory, relative to project root.
 * @param files {Array<String>}
 *        array of files to add to export.
 */
var addExports = function (basedir, files) {
  files.forEach(function (f) {
    EXPORTS.push(CWD + '/' + basedir + '/' + f + '.js:' + f);
  });
};

// List individual modules here. Each listed module will be aliased in the
// "bundle", and will be set as an external in "test"s and "example"s.

EXPORTS.push(CWD + '/etc/data.js:etc/data');
EXPORTS.push(CWD + '/etc/metadata.js:etc/metadata');
EXPORTS.push(NODE_MODULES + '/d3/d3.js:d3');

// hazdev-webutils exports
addExports('node_modules/hazdev-webutils/src', [
  'mvc/Collection',
  'mvc/CollectionSelectBox',
  'mvc/Model',
  'mvc/View',
  'util/Util',
  'util/Xhr'
]);

addExports('node_modules/hazdev-tablist/src', [
  'tablist/TabList'
]);

// project exports
addExports(config.src + '/htdocs/js', [
  'Analysis',
  'AnalysisCollectionView',
  'AnalysisView',
  'ApplicationView',
  'Calculator',
  'DependencyFactory',
  'EditionView',
  'HazardCurve',
  'HazardCurveDataView',
  'HazardCurveGraphView',
  'HazardResponse',
  'HazardUtil',
  'MapView',
  'Meta',
  'Region',
  'SiteClassView',
  'SpectralPeriodView',
  'StaticCurveInputView',
  'StaticCurveOutputView',
  'TimeHorizonInputView',
  'TimeHorizonSelectView',
  'TimeHorizonSliderView',

  'map/Fullscreen',
  'map/Layers',
  'map/LayerControl'
]);

// Subsequent source files can then require "Class" with:
// var Class = require('package/Class');


var browerify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        CWD + '/' + config.src + '/htdocs/js',
        NODE_MODULES,
        NODE_MODULES + '/hazdev-tablist/src',
        NODE_MODULES + '/hazdev-webutils/src',
        NODE_MODULES + '/hazdev-location-view/src'
      ]
    }
  },


  // the bundle used by the index page
  index: {
    src: [config.src + '/htdocs/js/index.js'],
    dest: config.build + '/' + config.src + '/htdocs/js/index.js',
    options: {
      external: [
        'leaflet'
      ]
    }
  },

  // the bundle used by tests
  bundle: {
    src: [],
    dest: config.build + '/' + config.src + '/htdocs/js/bundle.js',
    options: {
      alias: EXPORTS,
      external: [
        'leaflet'
      ]
    }
  },

  // the bundle of test suites
  test: {
    src: [config.test + '/js/test.js'],
    dest: config.build + '/' + config.test + '/js/test.js',
    options: {
      external: EXPORTS.concat(['leaflet'])
    }
  },

  // bundle leaflet externally
  leaflet: {
    src: [],
    dest: config.build + '/' + config.src + '/htdocs/lib/leaflet/leaflet.js',
    options: {
      alias: [
        NODE_MODULES + '/leaflet/dist/leaflet-src.js:leaflet'
      ]
    }
  }

};

module.exports = browerify;
