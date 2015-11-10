'use strict';

var D3LineView = require('d3/D3LineView'),
    Util = require('util/Util');


var ResponseSpectrumLineView = function (params) {
  var _this,
      _initialize,

      _curves,

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

  _initialize = function (params) {
    _this.el.classList.add('ResponseSpectrumLineView');
    _curves = params.curves;
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

  _onPointClick = function (data/*, index*/) {
    var pointImt = data[2];

    if (_curves) {
      _curves.data().some(function (c) {
        if (c.get('imt') === pointImt) {
          _curves.select(c);
          return true;
        }
      });
    }
  };


  /**
   * Override y value formatting.
   */
  _this.formatY = function (y) {
    return y.toFixed(4);
  };

  _this.plotPoints = function (points) {
    points.enter()
        .append('svg:circle')
        .attr('data-imt', _getImt)
        .on('mouseout', _this.onPointOut)
        .on('mouseover', _this.onPointOver)
        .on('click', _onPointClick);

    points.attr('r', _this.model.get('pointRadius'))
        .attr('class', _getPointClasses)
        .attr('cx', _this.getScaleX)
        .attr('cy', _this.getScaleY);

    points.exit()
        .on('mouseout', null)
        .on('mouseover', null)
        .on('click', null)
        .remove();
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = ResponseSpectrumLineView;
