'use strict';

var config = require('./config');

var uglify = {
  index: {
    src: [config.build + '/' + config.src + '/htdocs/js/index.js'],
    dest: config.dist + '/htdocs/js/index.js'
  },

  leaflet: {
    src: [config.build + '/' + config.src + '/htdocs/lib/leaflet/leaflet.js'],
    dest: config.dist + '/htdocs/lib/leaflet/leaflet.js'
  }
};

module.exports = uglify;
