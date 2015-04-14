'use strict';

var d3 = require('d3'),
    Model = require('mvc/Model'),
    Util = require('util/Util'),
    View = require('mvc/View');


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
 * @param options.xAxisLabel {String}
 *        label for x axis.
 * @param options.xAxisScale {d3.scale}
 *        default d3.scale.linear().
 * @param options.yAxisLabel {String}
 *        label for y axis.
 * @param options.yAxisScale {d3.scale}
 *        default d3.scale.linear().
 */
var D3GraphView = function (options) {
  var _this,
      _initialize,
      // variables
      _dataEl,
      _innerFrame,
      _margin,
      _outerFrame,
      _padding,
      _plotArea,
      _plotAreaClip,
      _plotTitle,
      _svg,
      _tooltip,
      _xEl,
      _xAxisEl,
      _xAxisLabel,
      _yEl,
      _yAxisEl,
      _yAxisLabel;

  _this = View(options);

  _initialize = function (options) {
    var el;

    _this.model = Model(Util.extend({
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
      width: 960,
      xAxisLabel: '',
      xAxisScale: d3.scale.log(),
      yAxisLabel: '',
      yAxisScale: d3.scale.log()
    }, options));

    options = _this.model.get();

    el = _this.el;
    el.innerHTML = '<div class="graph">' +
          '<svg xmlns="http://www.w3.org/2000/svg">' +
            '<defs>' +
              '<clipPath id="plotAreaClip">' +
                '<rect x="0" y="0"></rect>' +
              '</clipPath>' +
            '</defs>' +
            '<g class="margin">' +
              '<rect class="outer-frame"></rect>' +
              '<text class="plot-title" text-anchor="middle"></text>' +
              '<g class="padding">' +
                '<rect class="inner-frame"></rect>' +
                '<g class="plot-area">' +
                  '<g class="data"></g>' +
                  '<g class="x">' +
                    '<g class="axis"></g>' +
                    '<text class="label" text-anchor="middle"></text>' +
                  '</g>' +
                  '<g class="y">' +
                    '<g class="axis"></g>' +
                    '<text class="label" text-anchor="middle" transform="rotate(-90)"></text>' +
                  '</g>' +
                  '<g class="tooltip"></g>' +
                '</g>' +
              '</g>' +
            '</g>' +
          '</svg>' +
        '</div>' +
        '<div class="controls"></div>';

    _svg = el.querySelector('svg');
    _plotAreaClip = _svg.querySelector('#plotAreaClip > rect');
    _margin = _svg.querySelector('.margin');
    _outerFrame = _margin.querySelector('.outer-frame');
    _plotTitle = _margin.querySelector('.plot-title');
    _padding = _margin.querySelector('.padding');
    _innerFrame = _padding.querySelector('.inner-frame');
    _plotArea = _padding.querySelector('.plot-area');
    _dataEl = _plotArea.querySelector('.data');
    _xEl = _plotArea.querySelector('.x');
    _xAxisEl = _xEl.querySelector('.axis');
    _xAxisLabel = _xEl.querySelector('.label');
    _yEl = _plotArea.querySelector('.y');
    _yAxisEl = _yEl.querySelector('.axis');
    _yAxisLabel = _yEl.querySelector('.label');
    _tooltip = _plotArea.querySelector('.tooltip');

    _this.xAxis = d3.svg.axis()
        .orient('bottom');
    _this.yAxis = d3.svg.axis()
        .orient('left');

    _this.model.on('change', _this.render);
  };


  _this.render = function () {
    var height,
        innerWidth,
        innerHeight,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
        options,
        outerHeight,
        outerWidth,
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        title,
        width,
        xAxisLabel,
        xAxisScale,
        yAxisLabel,
        yAxisScale;

    // get current settings
    options = _this.model.get();
    width = options.width;
    height = options.height;
    marginBottom = options.marginBottom;
    marginLeft = options.marginLeft;
    marginRight = options.marginRight;
    marginTop = options.marginTop;
    paddingBottom = options.paddingBottom;
    paddingLeft = options.paddingLeft;
    paddingRight = options.paddingRight;
    paddingTop = options.paddingTop;
    title = options.title;
    xAxisLabel = options.xAxisLabel;
    xAxisScale = options.xAxisScale;
    yAxisLabel = options.yAxisLabel;
    yAxisScale = options.yAxisScale;
    // adjust based on margin/padding
    outerWidth = width - marginLeft - marginRight;
    outerHeight = height - marginTop - marginBottom;
    innerWidth = outerWidth - paddingLeft - paddingRight;
    innerHeight = outerHeight - paddingTop - paddingBottom;
    // set widths/heights
    _svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    _plotAreaClip.setAttribute('width', innerWidth);
    _plotAreaClip.setAttribute('height', innerHeight);
    _margin.setAttribute('transform',
        'translate(' + marginLeft + ',' + marginTop + ')');
    _outerFrame.setAttribute('height', outerHeight);
    _outerFrame.setAttribute('width', outerWidth);
    _plotTitle.setAttribute('x', outerWidth / 2);
    _plotTitle.setAttribute('y', paddingTop);
    _padding.setAttribute('transform',
        'translate(' + paddingLeft + ',' + paddingTop + ')');
    _innerFrame.setAttribute('width', innerWidth);
    _innerFrame.setAttribute('height', innerHeight);
    _xEl.setAttribute('transform',
        'translate(0,' + innerHeight + ')');
    // update axes
    xAxisScale.range([0, innerWidth]);
    xAxisScale.domain(_this.getXExtent());
    _this.xAxis.scale(xAxisScale);
    d3.select(_xAxisEl).call(_this.xAxis);
    yAxisScale.range([innerHeight, 0]);
    yAxisScale.domain(_this.getYExtent());
    _this.yAxis.scale(yAxisScale);
    d3.select(_yAxisEl).call(_this.yAxis);
    // update label
    _plotTitle.textContent = title;
    _xAxisLabel.textContent = xAxisLabel;
    _yAxisLabel.textContent = yAxisLabel;

    _xAxisLabel.setAttribute('x', innerWidth / 2);
    _xAxisLabel.setAttribute('y', _xAxisEl.getBBox().height + _xAxisLabel.getBBox().height);
    _yAxisLabel.setAttribute('x', -innerHeight / 2);
    _yAxisLabel.setAttribute('y', -_yAxisEl.getBBox().width - 10);

    // ask subclass to render
    _this.plot(_dataEl);
  };

  /**
   * Compute X axis domain.
   *
   * @return {Array}
   *         data domain.
   * @see d3.extent
   */
  _this.getXExtent = function () {
    return [0, 1];
  };

  /**
   * Compute Y axis domain.
   *
   * @return {Array}
   *         data domain.
   * @see d3.extent
   */
  _this.getYExtent = function () {
    return [0, 1];
  };

  /**
   * Method for subclasses to plot lines.
   */
  _this.plot = function (/*el*/) {
    // plot lines
  };

  _this.showTooltip = function (coords, lines) {
    var bbox,
        content,
        options,
        outline,
        padding = 5,
        tooltip,
        tooltipBbox,
        width,
        x,
        y;

    tooltip = d3.select(_tooltip);
    // hide tooltip
    tooltip.selectAll('*').remove();
    if (!coords || !lines) {
      return;
    }

    options = _this.model.get();
    // create tooltip content
    content = tooltip.append('g')
        .attr('class', 'tooltip-content');
    outline = content.append('rect')
        .attr('class', 'tooltip-outline');
    // add content to tooltip
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
    // position lines in tooltip
    width = 0;
    y = padding;
    lines.forEach(function (line) {
      var bbox = line.node().getBBox();
      width = Math.max(width, bbox.width);
      y += bbox.height;
      line.attr('x', padding).attr('y', y);
    });
    // set size of outline
    outline.attr('width', width + 2 * padding)
        .attr('height', y + padding);

    // position tooltip on graph
    // center of point
    x = options.xAxisScale(coords[0]);
    y = options.yAxisScale(coords[1]);
    // box rendering inside
    bbox = _dataEl.getBBox();
    // box being rendered
    tooltipBbox = _tooltip.getBBox();
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
    _tooltip.setAttribute('transform',
        'translate(' + x + ',' + y + ')');
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = D3GraphView;
