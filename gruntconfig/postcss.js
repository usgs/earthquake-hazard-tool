'use strict';

var autoprefixer = require('autoprefixer-core'),
    cssnano = require('cssnano');


var config = require('./config');


var postcss = {
  options: {
    processors: [
      autoprefixer({'browsers': 'last 2 versions'}), // vendor prefix as needed
      cssnano({zindex: false}) // minify
    ]
  },

  index: {
    src: [config.build + '/' + config.src + '/htdocs/css/index.css'],
    dest: config.dist + '/htdocs/css/index.css'
  },

  leaflet: {
    src: [config.build + '/' + config.src + '/htdocs/lib/leaflet/leaflet.css'],
    dest: config.dist + '/htdocs/lib/leaflet/leaflet.css'
  }
};

module.exports = postcss;
