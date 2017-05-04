'use strict';

var D3LineView = require('d3/D3LineView'),
    Util = require('util/Util');


var ResponseSpectrumLineView = function (params) {
  var _this,
      _initialize;


  _this = D3LineView(Util.extend({
    data: [],
    legend: null,
    pointRadius: 3,
    showLine: true,
    showPoints: true,
    imt: null
  }, params));

  _initialize = function (params) {
    _this.el.classList.add('ResponseSpectrumLineView');
    _this.curves = params.curves;
  };


  _this.getImt = function (data/*, index, scope*/) {
    return data[2];
  };

  _this.getPointClasses = function (data/*, index, scope*/) {
    var classes;

    classes = ['point'];

    if (_this.getImt(data) === _this.model.get('imt')) {
      classes.push('selected');
    }

    return classes.join(' ');
  };

  _this.onPointClick = function (data/*, index*/) {
    var pointImt = data[2];

    if (_this.curves) {
      _this.curves.data().some(function (c) {
        if (c.get('imt') === pointImt) {
          _this.curves.select(c);
          return true;
        }
      });
    }
  };


  _this.formatX = function (x) {
    if (x === 0) {
      return 'PGA';
    } else {
      return x;
    }
  };

  /**
   * Override y value formatting.
   */
  _this.formatY = function (y) {
    return y.toFixed(4);
  };

  /**
   * @Override `D3LineView.onPointOut`
   *
   * Overrides the parent implementation. This view shows the tooltip
   * of the currently selected point and hover interaction is not required.
   *
   */
  _this.onPointOut = function () {
    // Do nothing.
  };

  /**
   * @Override `D3LineView.onPointOver`
   *
   * Overrides the parent implementation. This view shows the tooltip
   * of the currently selected point and hover interaction is not required.
   *
   */
  _this.onPointOver = function () {
    // Do nothing
  };

  _this.plotPoints = function (points) {
    points.enter()
        .append('svg:circle')
        .attr('data-imt', _this.getImt)
        .on('mouseout', _this.onPointOut)
        .on('mouseover', _this.onPointOver)
        .on('click', _this.onPointClick);

    points.attr('r', _this.model.get('pointRadius'))
        .attr('class', _this.getPointClasses)
        .attr('data-index', function (d, i) { return i+1; })
        .attr('cx', _this.getScaleX)
        .attr('cy', _this.getScaleY);

    points.exit()
        .on('mouseout', null)
        .on('mouseover', null)
        .on('click', null)
        .remove();
  };

  /**
   * Extend the `D3LineView.render` method. Do everything done in parent class
   * (via composition), but then also look at current IMT, find corresponding
   * point, and show the tooltip for that point.
   *
   */
  _this.render = Util.compose(_this.render, function () {
    var data,
        i,
        imt,
        info,
        point;

    data = _this.model.get('data');
    imt = _this.model.get('imt');

    if (!imt) {
      return;
    }

    for (i = 0; i < data.length; i++) {
      point = data[i];
      if (_this.getImt(point) === imt) {
        break;
      }
    }

    info = [
      {text: _this.model.get('label')},
      [
        {class: 'label', text: _this.view.model.get('xLabel') + ': '},
        {class: 'value', text: _this.formatX(point[0])}
      ],
      [
        {class: 'label', text: _this.view.model.get('yLabel') + ': '},
        {class: 'value', text: _this.formatY(point[1])}
      ]
    ];

    _this.view.showTooltip(point, info);
  });


  _initialize(params);
  params = null;
  return _this;
};


module.exports = ResponseSpectrumLineView;
