'use strict';

var config = require('./config');

var CWD = '.',
    EXPORTS = [],
    NODE_MODULES = CWD + '/node_modules',
    RESPONSE_HANDLERS = [];


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
EXPORTS.push(CWD + '/etc/deagg.js:etc/deagg');
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

addExports('node_modules/hazdev-accordion/src', [
  'accordion/Accordion'
]);

// project exports
addExports(config.src + '/htdocs/js', [
  'ActionsView',
  'Analysis',
  'AnalysisCollectionView',
  'AnalysisView',
  'ApplicationView',
  'Calculator',
  'ContourTypeView',
  'DataExport',
  'DependencyFactory',
  'DynamicHazardResponse',
  'EditionView',
  'HazardCurve',
  'HazardCurveGraphView',
  'HazardResponse',
  'HazardUtil',
  'LocationInfoView',
  'MapView',
  'Meta',
  'Region',
  'ResponseSpectrumGraphView',
  'SiteClassView',
  'SpectralPeriodView',
  'TimeHorizonInputView',
  'TimeHorizonSelectView',
  'TimeHorizonSliderView',

  'deagg/Deaggregation',
  'deagg/DeaggResponse',
  'deagg/DeaggregationGraphView',

  'map/Layers',
  'map/LayerControl'
]);

RESPONSE_HANDLERS.push('HazardResponse');
RESPONSE_HANDLERS.push('DynamicHazardResponse');

// Subsequent source files can then require "Class" with:
// var Class = require('package/Class');


var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        CWD + '/' + config.src + '/htdocs/js',
        NODE_MODULES,
        NODE_MODULES + '/hazdev-accordion/src',
        NODE_MODULES + '/hazdev-d3/src',
        NODE_MODULES + '/hazdev-tablist/src',
        NODE_MODULES + '/hazdev-webutils/src',
        NODE_MODULES + '/hazdev-location-view/src',
        NODE_MODULES + '/hazdev-leaflet/src'
      ]
    }
  },


  // the bundle used by the index page
  index: {
    src: [config.src + '/htdocs/js/index.js'],
    dest: config.build + '/' + config.src + '/htdocs/js/index.js',
    options: {
      require: RESPONSE_HANDLERS,
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
      require: RESPONSE_HANDLERS,
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
      require: RESPONSE_HANDLERS,
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

module.exports = browserify;
