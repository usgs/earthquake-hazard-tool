'use strict';

var D3LineView = require('d3/D3LineView');


var HazardCurveLineView = function (options) {
  var _this;

  _this = D3LineView(options);

  /**
   * Override formatting for y values.
   */
  _this.formatY = function (y) {
    return y.toExponential(5);
  };

  return _this;
};


module.exports = HazardCurveLineView;
