'use strict';

var autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    postcssImport = require('postcss-import'),
    precss = require('precss');

var config = require('./config');
var CWD = '.';

var postcss = {
  dev: {
    expand: true,
    cwd: config.src + '/htdocs',
    dest: config.build + '/' + config.src + '/htdocs',
    ext: '.css',
    extDot: 'last',
    options: {
      map: 'inline',
      processors: [
        postcssImport({
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
        precss(),
        autoprefixer({'browsers': 'last 2 versions'})
      ]
    },
    src: 'css/index.scss'
  },

  dist: {
    dest: config.dist + '/htdocs/css/index.css',
    options: {
      processors: [
        cssnano({zindex: false})
      ]
    },
    src: config.build + '/' + config.src + '/htdocs/css/index.css'
  }
};

module.exports = postcss;
