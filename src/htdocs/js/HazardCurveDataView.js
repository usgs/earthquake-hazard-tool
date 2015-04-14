'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');

var DEFAULTS = {
  sites: null
};

var HazardCurveDataView = function (options) {
  var _this,
      _initialize,

      // variables
      _sites;

  _this = View(options);

  _initialize = function (options) {
    options = Util.extend({}, DEFAULTS, options);

    // read site array from options
    _sites = options.responses || [];

    // TODO, build a collection of analysis models
    // TODO, display the collection of analysis models
  };

  _this.destroy = Util.compose(function () {
    _sites = null;
  }, _this.destroy);

  _initialize(options);
  options = null;
  return _this;
};

module.exports = HazardCurveDataView;