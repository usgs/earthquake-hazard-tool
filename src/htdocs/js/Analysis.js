'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');

var SALT = 'analysis',
    SEQUENCE = 0;

var Analysis = function (options) {
  var _this,
      _initialize,

      _createUniqueId;


  _this = Model(Util.extend({
    edition: null,
    region: null,

    latitude: null,
    longitude: null,

    imt: null,
    vs30: null,

    timeHorizon: null,
    contourType: null

  }, options));

  _initialize = function (/*options*/) {
    if (typeof _this.id === 'undefined' || _this.id === null) {
      _this.set({id: _createUniqueId()});
    }
  };

  _createUniqueId = function () {
    return SALT + '-' + (new Date()).getTime() + '-' + (SEQUENCE++);
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _createUniqueId = null;
  });

  _initialize(options);
  options = null;
  return _this;
};

module.exports = Analysis;
