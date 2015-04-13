'use strict';

var d3 = require('d3'),
    Util = require('util/Util'),
    View = require('mvc/View');


var EPSILON = Number.EPSILON;
EPSILON = 1e-20;

var __replaceZeros = function (n) {
  if (n < EPSILON) {
    return EPSILON;
  } else {
    return n;
  }
};


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
      _el,
      _initData,
      _line,
      _lineFormat,
      _tooltip,
      _x,
      _y,
      // methods
      _formatTooltip,
      _getX,
      _getY,
      _onMouseOut,
      _onMouseOver,
      _onPointOut,
      _onPointOver;

  _this = View(options);

  _initialize = function (options) {
    _el = _this.el;
    _el.attr('class', 'HazardCurveLine');

    _curve = options.curve;
    _lineFormat = options.lineFormat || d3.svg.line();
    _tooltip = options.tooltip;
    _x = options.xScale;
    _y = options.yScale;

    _lineFormat.x(_getX);
    _lineFormat.y(_getY);

    _line = _el.append('svg:path')
        .attr('class', 'line')
        .attr('clip-path', 'url(#clipToPlotArea)');


    _el.on('mouseout', _onMouseOut);
    _el.on('mouseover', _onMouseOver);

    _initData();
  };

  /**
   * Convert a data coordinate to a plot coordinate.
   *
   * @param d {Array<Number>}
   *        data point.
   * @return {Number} x plot coordinate.
   */
  _getX = function (d) {
    return _x(d[0]);
  };

  /**
   * Convert a data coordinate to a plot coordinate.
   *
   * @param d {Array<Number>}
   *        data point.
   * @return {Number} y plot coordinate.
   */
  _getY = function (d) {
    return _y(d[1]);
  };

  /**
   * Convert curve data array to an array of coordinates to plot.
   */
  _initData = function () {
    var xvals = _curve.get('xvals'),
        yvals = _curve.get('yvals')[0].yvals;
    xvals = xvals.map(__replaceZeros);
    yvals = yvals.map(__replaceZeros);
    _this.data = d3.zip(xvals, yvals);
    _this.xExtent = d3.extent(xvals);
    _this.yExtent = d3.extent(yvals);
  };

  /**
   * Format tooltip content.
   *
   * @param lines {Array<Object>}
   *        lines to show in tooltip.
   *        each line has the following keys:
   *        line.label {String}
   *        line.value {String}
   */
  _formatTooltip = function (lines) {
    var content,
        outline,
        padding = 5,
        width,
        y;

    content = _tooltip.append('g')
        .attr('class', 'tooltip-content');

    outline = content.append('rect')
        .attr('class', 'tooltip-outline');

    lines = lines.map(function (line) {
      var text = content.append('text');
      if (typeof line === 'string') {
        text.text(line);
      } else {
        if (line.label) {
          text.append('tspan')
              .attr('class', 'label')
              .text(line.label);
        }
        if (line.value) {
          text.append('tspan')
              .attr('class', 'value')
              .text(line.value);
        }
      }
      return text;
    });

    width = 0;
    y = padding;
    lines.forEach(function (line) {
      var bbox = line.node().getBBox();
      width = Math.max(width, bbox.width);
      y += bbox.height;
      line.attr('x', padding).attr('y', y);
      y += padding;
    });

    outline.attr('width', width + 2 * padding)
        .attr('height', y + padding);
  };

  /**
   * Event listener for mouseout.
   */
  _onMouseOut = function () {
    _el.node().classList.remove('mouseover');
  };

  /**
   * Event listener for mouseover.
   */
  _onMouseOver = function () {
    _el.node().classList.add('mouseover');
  };

  /**
   * Event listener for point mouseout.
   */
  _onPointOut = function () {
    var point;

    point = d3.event.target;
    point.classList.remove('mouseover');
    point.setAttribute('r', point.getAttribute('r') / 2);

    // clear previous tooltip
    _tooltip.attr('transform', null)
        .selectAll('*').remove();
  };

  /**
   * Event listener for point mouseover.
   */
  _onPointOver = function (coords) {
    var curve = _curve.get(),
        x,
        y,
        bbox,
        point,
        tooltipBbox;

    point = d3.event.target;
    point.classList.add('mouseover');
    point.setAttribute('r', point.getAttribute('r') * 2);

    _formatTooltip([
      curve.edition.display,
      {
        'label': curve.xlabel + ': ',
        'value': (coords[0] === EPSILON ? 0 : coords[0])
      },
      {
        'label': curve.ylabel + ': ',
        'value': (coords[1] === EPSILON ? 0 :
            coords[1].toExponential())
      }
    ]);

    // center of point
    x = _x(coords[0]);
    y = _y(coords[1]);
    // box rendering inside
    bbox = _el.node().getBBox();
    // box being rendered
    tooltipBbox = _tooltip.node().getBBox();
    // keep tooltip in graph area
    if (x + tooltipBbox.width > bbox.width) {
      x = x - tooltipBbox.width - 10;
    } else {
      x = x + 10;
    }
    if (y + tooltipBbox.height > bbox.height) {
      y = y - tooltipBbox.height - 10;
    } else {
      y = y + 10;
    }
    // set position
    _tooltip.attr('transform', 'translate(' + x + ',' + y + ')');
  };

  /**
   * Set the x and y scales used during rendering.
   *
   * @param xScale {d3.scale}
   *        x axis scale.
   * @param yScale {d3.scale}
   *        y axis scale.
   */
  _this.setScales = function (xScale, yScale) {
    _x = xScale;
    _y = yScale;
  };

  /**
   * Update this line.
   */
  _this.render = function () {
    var points;

    points = _el.selectAll('.point')
        .data(_this.data);
    points.enter()
        .append('svg:circle')
        .attr('class', 'point')
        .attr('r', 3)
        .on('mouseout', _onPointOut)
        .on('mouseover', _onPointOver);
    // set x,y coordinates
    points.attr('cx', _getX)
        .attr('cy', _getY);
    points.exit()
        .on('mouseout', _onPointOut)
        .on('mouseover', _onPointOver)
        .remove();

    _line.attr('d', _lineFormat(_this.data));
  };

  /**
   * Unbind events and free references.
   */
  _this.destroy = Util.compose(function () {
    var el;

    // trigger d3 cleanup
    _this.data = [];
    _this.render();

    _el.on('mouseout', null);
    _el.on('mouseover', null);

    // remove container
    el = _el.node();
    Util.detach(el);
  }, _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = HazardCurveLineView;
