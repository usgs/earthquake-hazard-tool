'use strict';

var config = require('./config');

var compass = {
  dev: {
    options: {
      sassDir: config.src,
      cssDir: config.build + '/' + config.src,
      environment: 'development',
      importPath: [
        'node_modules/hazdev-location-view/src',
        'node_modules/hazdev-tablist/src',
        'node_modules/hazdev-template/src/htdocs',
        'node_modules/hazdev-webutils/src'
      ]
    }
  }
};

module.exports = compass;
