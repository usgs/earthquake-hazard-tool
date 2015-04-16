'use strict';

var config = require('./config');

var cssmin = {
  index: {
    options: {
      processImport: false
    },
    src: [config.build + '/' + config.src + '/htdocs/css/index.css'],
    dest: config.dist + '/htdocs/css/index.css'
  },

  leaflet: {
    src: [config.build + '/' + config.src + '/htdocs/lib/leaflet/leaflet.css'],
    dest: config.dist + '/htdocs/lib/leaflet/leaflet.css'
  }
};

module.exports = cssmin;
