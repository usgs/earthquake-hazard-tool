'use strict';

var config = require('./config');

var mocha_phantomjs = {
  test: {
    options: {
      urls: [
        'http://localhost:' + config.testPort + '/test.html'
      ]
    }
  },

  coverage: {
    options: {
      urls: [
        'http://localhost:' + config.coveragePort + '/test.html',
      ],
      config: {
        hooks: ['mocha-phantomjs-istanbul']
      }
    }
  }
};

module.exports = mocha_phantomjs;
