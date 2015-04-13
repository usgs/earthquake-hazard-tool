'use strict';

var d3 = require('d3'),
    Util = require('util/Util'),
    View = require('mvc/View');


var DEFAULTS = {
  height: 500,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  paddingBottom: 50,
  paddingLeft: 100,
  paddingRight: 100,
  paddingTop: 50,
  title: '',
  width: 960
};


/**
 * Base class for D3 plotting.
 *
 * Creates svg element, setting viewBox to width and height.
 * Padding and margin are subtracted from the viewBox.
 *
 * Creates an svg:rect with class "outer-frame" inside margin.
 * Creates an svg:rect with class "inner-frame" inside padding.
 * Creates an svg:text with class "plot-title" centered at top of plot area.
 * Creates an svg:g with class "plot-area" for ploting.
 * Sets properties for subclass use during render:
 *     D3GraphView.height {Number}
 *                        height of plotArea.
 *     D3GraphView.plotArea {SVGElement}
 *                          plot area for graph.
 *     D3GraphView.width {Number}
 *                       width of plotArea.
 *
 * @param options {Object}
 *        all options are passed to View.
 * @param options.height {Number}
 *        default 500.
 *        height of svg viewBox.
 * @param options.marginBottom {Number}
 *        default 0.
 * @param options.marginLeft {Number}
 *        default 0.
 * @param options.marginRight {Number}
 *        default 0.
 * @param options.marginTop {Number}
 *        default 0.
 * @param options.paddingBottom {Number}
 *        default 50.
 * @param options.paddingLeft {Number}
 *        default 100.
 * @param options.paddingRight {Number}
 *        default 100.
 * @param options.paddingTop {Number}
 *        default 50.
 * @param options.title {String}
 *        title for plot.
 * @param options.width {Number}
 *        default 960.
 *        width of svg viewBox.
 */
var D3GraphView = function (options) {
  var _this,
      _initialize,
      // variables
      _height,
      _innerFrame,
      _outerFrame,
      _plotArea,
      _plotTitle,
      _svg,
      _width;

  _this = View(options);

  _initialize = function (options) {
    var clipToPlotArea,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        title;

    options = Util.extend({}, DEFAULTS, options);
    marginBottom = options.marginBottom;
    marginLeft = options.marginLeft;
    marginRight = options.marginRight;
    marginTop = options.marginTop;
    paddingBottom = options.paddingBottom;
    paddingLeft = options.paddingLeft;
    paddingRight = options.paddingRight;
    paddingTop = options.paddingTop;
    title = options.title;

    // svg container
    _height = options.height;
    _width = options.width;
    _svg = d3.select(_this.el).append('svg:svg')
        .attr('viewBox', '0 0 ' + _width + ' ' + _height);

    clipToPlotArea = _svg.append('g:defs')
        .append('clipPath')
        .attr('id', 'clipToPlotArea')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0);

    // outer frame is margin
    _height = _height - marginBottom - marginTop;
    _width = _width - marginLeft - marginRight;
    _outerFrame = _svg.append('g')
        .attr('transform',
            'translate(' + marginLeft + ',' + marginTop + ')');
    _outerFrame.append('rect')
        .attr('class', 'outer-frame')
        .attr('height', _height)
        .attr('width', _width);

    // anchor to top center of inner frame
    // (do this before subtracting padding from width)
    _plotTitle = _outerFrame.append('text')
        .attr('class', 'plot-title')
        .attr('text-anchor', 'middle')
        .attr('x', _width / 2)
        .attr('y', paddingTop)
        .text(title);

    // inner frame is padding
    _height = _height - paddingBottom - paddingTop;
    _width = _width - paddingLeft - paddingRight;
    _innerFrame = _outerFrame.append('g')
        .attr('transform',
            'translate(' + paddingLeft + ',' + paddingTop + ')');
    _innerFrame.append('rect')
        .attr('class', 'inner-frame')
        .attr('height', _height)
        .attr('width', _width);

    // plotArea is container where everything is plotted
    _plotArea = _innerFrame.append('g')
        .attr('class', 'plot-area');

    clipToPlotArea.attr('height', _height)
        .attr('width', _width);

    // expose these variables for subclass use.
    _this.height = _height;
    _this.plotArea = _plotArea;
    _this.width = _width;
  };

  /**
   * Set the plot title.
   *
   * @param title {String}
   *        plot title.
   */
  _this.setTitle = function (title) {
    _plotTitle.text(title);
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = D3GraphView;
