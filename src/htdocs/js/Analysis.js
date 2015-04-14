'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');

var Analysis = function (options) {
  var _this;


  _this = Model(Util.extend({
    edition: null,
    region: null,

    latitude: null,
    longitude: null,

    imt: null,
    vs30: null
  }, options));


  options = null;
  return _this;
};

module.exports = Analysis;
