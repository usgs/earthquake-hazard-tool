'use strict';


var config = require('./config');


var istanbul = {
  src: config.coverage + '/**/*.json',
  options: {
    type: 'lcov',
    dir: config.coverage,
    print: 'detail'
  }
};


module.exports = istanbul;