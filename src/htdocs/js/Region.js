'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util'),
    Meta = require('Meta');

var Region = function (options) {
  var _this;

  _this = Meta(Util.extend({
    minlatitude: null,
    maxlatitued: null,
    minlongitude: null,
    maxlongitude: null,
    gridspacing: null
  }, options));

  options = null;
  return _this;
};

module.exports = Region;
