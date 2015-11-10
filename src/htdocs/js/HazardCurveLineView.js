'use strict';

var D3LineView = require('d3/D3LineView'),
    Util = require('util/Util');


var HazardCurveLineView = function (params) {
  var _this,
      _initialize;


  _this = D3LineView(Util.extend({
      pointRadius: 2
    }, params));

  _initialize = function (/*params*/) {
    _this.el.classList.add('HazardCurveLineView');
  };

  /**
   * Override formatting for y values.
   */
  _this.formatY = function (y) {
    return y.toExponential(5);
  };

  _initialize(params);
  params = null;
  return _this;
};


module.exports = HazardCurveLineView;
