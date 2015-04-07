'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');


var Meta = function(options) {
  var _this;

  _this = Model(Util.extend({
    id: null,
    value: null,
    display: null,
    displayorder: null
  }, options));

  _initialize = function (options) {
    options = null;
  };

  _initialize(options);
  return _this;
};

module.exports = Meta;
