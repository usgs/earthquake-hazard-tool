'use strict';

var autoprefixer = require('autoprefixer-core'),
    cssnano = require('cssnano'),
    precss = require('precss');

var config = require('./config');
var CWD = process.cwd();

var postcss = {
  dev: {
    options: {
      map: true,
      processors: [
        precss({
          path: [
            CWD + '/' + config.src,
            CWD + '/node_modules/hazdev-accordion/src',
            CWD + '/node_modules/hazdev-d3/src',
            CWD + '/node_modules/leaflet/dist',
            CWD + '/node_modules/hazdev-leaflet/src',
            CWD + '/node_modules/hazdev-location-view/src',
            CWD + '/node_modules/hazdev-tablist/src',
            CWD + '/node_modules/hazdev-template/src/htdocs',
            CWD + '/node_modules/hazdev-webutils/src'
          ]
        }),
        autoprefixer({'browsers': 'last 2 versions'}), // vendor prefix as needed
      ]
    },
    src: config.src + '/htdocs/css/index.scss',
    dest: config.build + '/' + config.src + '/htdocs/css/index.css'
  },

  dist: {
    options: {
      processors: [
        cssnano({zindex: false}) // minify
      ]
    },
    src: config.build + '/' + config.src + '/htdocs/css/index.css',
    dest: config.dist + '/htdocs/css/index.css'
  }
};

module.exports = postcss;
