'use strict';

var D3LineView = require('d3/D3LineView'),
    Util = require('util/Util');


var ResponseSpectrumLineView = function (params) {
  var _this,
      _initialize,

      _getImt,
      _getPointClasses,
      _onPointClick;


  _this = D3LineView(Util.extend({
    data: [],
    legend: null,
    showLine: true,
    showPoints: true,
    imt: null
  }, params));

  _initialize = function (/*params*/) {
    _this.el.classList.add('ResponseSpectrumLineView');
  };


  _getImt = function (data/*, index, scope*/) {
    return data[2];
  };

  _getPointClasses = function (data/*, index, scope*/) {
    var classes = ['point'];

    if (_getImt(data) === _this.model.get('imt')) {
      classes.push('selected');
    }

    return classes.join(' ');
  };

  _onPointClick = function (/*data, index*/) {
    console.log('point clicked!');
    console.log(arguments);
  };


  /**
   * Override y value formatting.
   */
  _this.formatY = function (y) {
    return y.toFixed(4);
  };

  return _this;
};


module.exports = ResponseSpectrumLineView;
