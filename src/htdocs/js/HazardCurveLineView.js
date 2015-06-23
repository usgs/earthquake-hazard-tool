'use strict';

var d3 = require('d3'),
    Util = require('util/Util'),
    View = require('mvc/View');

/**
 * Display a single hazard curve on a HazardCurveGraphView.
 *
 * @param options {Object}
 *        passed to view.
 * @param options.el {D3Element}
 *        D3 selection with svg container, usually svg:g.
 * @param options.curve {HazardCurve}
 *        curve to display.
 * @param options.lineFormat {d3.svg.line()}
 *        default is new d3.svg.line().
 * @param options.tooltip {D3Element}
 *        D3 seletion with svg container, usually svg:g.
 * @param options.xScale {d3.scale}
 *        scale for x axis.
 * @param options.yScale {d3.scale}
 *        scale for y axis.
 */
var HazardCurveLineView = function (options) {
  var _this,
      _initialize,
      // variables
      _curve,
      _data,
      _el,
      _graph,
      _legend,
      _legendLine,
      _legendText,
      _line,
      _lineFormat,
      _x,
      _y,
      // methods
      _getScaleX,
      _getScaleY,
      _getX,
      _getY,
      _initData,
      _onMouseOut,
      _onMouseOver,
      _onPointOut,
      _onPointOver;

  _this = View(options);

  /**
   * Initialize the view.
   */
  _initialize = function (options) {
    _el = d3.select(_this.el);
    _el.attr('class', 'HazardCurveLine');

    _curve = _this.model;
    _graph = options.graph;

    _this.model.set({
      showPoints: options.showPoints
    }, {silent: true});
    _this.model.on('change:data', _initData);

    _lineFormat = options.lineFormat || d3.svg.line();
    _lineFormat.x(_getScaleX);
    _lineFormat.y(_getScaleY);

    _line = _el.append('svg:path')
        .attr('class', 'line')
        .attr('clip-path', 'url(#plotAreaClip)');

    _el.on('mouseout', _onMouseOut);
    _el.on('mouseover', _onMouseOver);

    _this.legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    _legend = d3.select(_this.legend)
        .attr('class', 'HazardCurveLine')
        .on('mouseout', _onMouseOut)
        .on('mouseover', _onMouseOver);
    _legendLine = _legend.append('path')
        .attr('class', 'line')
        .attr('d', 'M0,0L25,0');
    _legendText = _legend.append('text')
        .attr('dx', 30);

    _initData();
  };

  /**
   * Convert a data coordinate to a plot coordinate.
   *
   * @param d {Array<Number>}
   *        data point.
   * @return {Number} x plot coordinate.
   */
  _getScaleX = function (d) {
    return _x(d[0]);
  };

  /**
   * Convert a data coordinate to a plot coordinate.
   *
   * @param d {Array<Number>}
   *        data point.
   * @return {Number} y plot coordinate.
   */
  _getScaleY = function (d) {
    return _y(d[1]);
  };

  /**
   * Convert an x data coordinate from a data object.
   *
   * @param d {Array<Number>}
   *        data point.
   * @return {Number} x plot coordinate.
   */
  _getX = function (d) {
    return d[0];
  };

  /**
   * Get a y data coordinate from a data object.
   *
   * @param d {Array<Number>}
   *        data point.
   * @return {Number} y plot coordinate.
   */
  _getY = function (d) {
    return d[1];
  };

  /**
   * Convert curve data array to an array of coordinates to plot.
   */
  _initData = function () {
    _data = _curve.get('data');
    _this.xExtent = d3.extent(_data, _getX);
    _this.yExtent = d3.extent(_data, _getY);
  };

  /**
   * Event listener for mouseout.
   */
  _onMouseOut = function () {
    _el.node().classList.remove('mouseover');
    _this.legend.classList.remove('mouseover');
  };

  /**
   * Event listener for mouseover.
   */
  _onMouseOver = function () {
    _el.node().classList.add('mouseover');
    _this.legend.classList.add('mouseover');
  };

  /**
   * Event listener for point mouseout.
   */
  _onPointOut = function () {
    var point;

    point = d3.event.target;
    point.classList.remove('mouseover');

    // clear previous tooltip
    _graph.showTooltip(null, null);
  };

  /**
   * Event listener for point mouseover.
   */
  _onPointOver = function (coords) {
    var point,
        model;

    point = d3.event.target;
    point.classList.add('mouseover');

    model = _graph.model;
    _graph.showTooltip(coords, [
      {text:_curve.get('label')},
      [
        {class: 'label', text: model.get('xAxisLabel') + ': '},
        {class: 'value', text: coords[0]}
      ],
      [
        {class: 'label', text: model.get('yAxisLabel') + ': '},
        {class: 'value', text: coords[1].toExponential(5)}
      ]
    ]);
  };

  /**
   * Update this line.
   */
  _this.render = function () {
    var points;

    // update scales
    _x = _graph.model.get('xAxisScale');
    _y = _graph.model.get('yAxisScale');

    _line.attr('d', _lineFormat(_data));
    _legendText.text(_curve.get('label'));
    _legendLine.attr('d', 'M0,0L25,0');

    points = _el.selectAll('.point')
        .data(_data);
    if (!_this.model.get('showPoints')) {
      points.remove();
    } else {
      points.enter()
          .append('svg:circle')
          .attr('class', 'point')
          .attr('r', _graph.model.get('pointRadius'))
          .on('mouseout', _onPointOut)
          .on('mouseover', _onPointOver);
      // set x,y coordinates
      points.attr('cx', _getScaleX)
          .attr('cy', _getScaleY);
      points.exit()
          .on('mouseout', _onPointOut)
          .on('mouseover', _onPointOver)
          .remove();
    }
  };

  /**
   * Unbind events and free references.
   */
  _this.destroy = Util.compose(function () {
    var points;

    _el.on('mouseout', null);
    _el.on('mouseover', null);
    _legend.on('mouseout', null);
    _legend.on('mouseover', null);
    _this.model.off('change:data', _initData);

    // cleanup events
    points = _el.selectAll('.point')
        .on('mouseout', null)
        .on('mouseover', null);
    _data = null;
    _x = null;
    _y = null;

    // remove container
    Util.detach(_el.node());
    _el = null;
    _legend = null;
    _legendLine = null;
    _legendText = null;
    _this = null;
  }, _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = HazardCurveLineView;
