'use strict';

var Util = require('util/Util');

var Site = function (options) {
  var _this;

  _this = Model(Util.extend({
    latitude: null,
    longitude: null,
    edition: null,
    region: null,
    vs30: null,
    curve: null,
    imt: null
  }, options));

  options = null;
  return _this;
};

module.exports = Site;
