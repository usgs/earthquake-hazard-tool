'use strict';

var config = require('./config');

var clean = {
  build: [
    config.build,
    config.coverage,
    '.sass-cache'
  ],

  dist: [
    config.dist
  ]
};

module.exports = clean;
