'use strict';

var D3LineView = require('d3/D3LineView'),
    Util = require('util/Util');


var ResponseSpectrumLineView = function (options) {
  var _this;

  _this = D3LineView(Util.extend({
    data: [],
    legend: null,
    showLine: true,
    showPoints: true
  }, options));

  _this.el.classList.add('ResponseSpectrumLineView');

  /**
   * Override y value formatting.
   */
  _this.formatY = function (y) {
    return y.toFixed(4);
  };

  return _this;
};


module.exports = ResponseSpectrumLineView;
