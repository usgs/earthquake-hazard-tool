'use strict';

var config = require('./config');

var uglify = {
  index: {
    src: [config.build + '/' + config.src + '/htdocs/js/index.js'],
    dest: config.dist + '/htdocs/js/index.js'
  }
};

module.exports = uglify;
