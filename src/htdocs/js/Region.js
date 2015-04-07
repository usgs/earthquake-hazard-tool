'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util'),
    Meta = require('Meta');

var Region = function(options) {
  var _this,
      _initialize;

  _this = Meta(Util.extend({
    minlatitude: null,
    maxlatitued: null,
    minlongitude: null,
    maxlongitude: null,
    gridspacing: null
  }, options));

  _initialize = function (options) {
    options = null;
  };

  _intialize(options);
  return _this;
}
