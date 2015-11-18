'use strict';

var Collection = require('mvc/Collection'),
    d3 = require('d3'),
    D33dAxis = require('d3/D33dAxis'),
    D33dDeaggregationBin = require('./D33dDeaggregationBin'),
    D33dPath = require('d3/D33dPath'),
    D33dView = require('d3/D33dView'),
    D3Util = require('d3/D3Util'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');


var _DEFAULTS = {};


/**
 * A deaggregation distance/magnitude plot.
 *
 * @param options {Object}
 *        options are passed to SelectedCollectionView.
 * @param options.collection {Collection<Deaggregation>}
 *        collection with data to display.
 *        selected Deaggregation object is displayed.
 */
var DeaggregationGraphView = function (options) {
  var _this,
      _initialize,
      // variables
      _axes,
      _bins,
      _d33d,
      _xScale,
      _yScale,
      _zScale,
      // methods
      _createAxes,
      _formatX,
      _formatY,
      _formatZ,
      _renderLegend;


  _this = SelectedCollectionView(options);

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _this.el.innerHTML = '<div class="DeaggregationGraphView"></div>';

    _axes = [];
    _bins = [];

    _xScale = 2;
    _yScale = 25;
    _zScale = 2;

    _d33d = D33dView({
      el: _this.el.querySelector('.DeaggregationGraphView'),
      lookAt: [
        35 * _xScale,
        5 * _yScale,
        10 * _zScale
      ],
      origin: [
        140 * _xScale,
        -5 * _yScale,
        90 * _zScale
      ],
      up: [0, 0, 1],
      zoom: 4
    });
    _d33d.renderLegend = _renderLegend;

    _createAxes();
  };

  /**
   * Create axes to be plotted.
   *
   * TODO: eliminate "magic" numbers.
   * Extents and tick, label, and title, vectors arre hard coded and work for
   * the current lookAt, origin, and zoom, combination.
   */
  _createAxes = function () {
    var extent,
        metadata,
        x,
        x0,
        x1,
        xLabel,
        xTickSpacing,
        xTicks,
        y,
        y0,
        y1,
        yLabel,
        yTickSpacing,
        yTicks,
        z0,
        z1,
        zLabel;

    if (_this.model) {
      metadata = _this.model.get('metadata');
    } else {
      metadata = {};
    }
    x0 = 0;
    x1 = 60 * _xScale;
    xLabel = metadata.rlabel;
    xTicks = 6;
    y0 = 5 * _yScale;
    y1 = 8 * _yScale;
    yLabel = metadata.mlabel;
    yTicks = 6;
    z0 = 0;
    z1 = 35 * _zScale;
    zLabel = metadata.εlabel;

    // x axis at y0
    extent = [[x0, y0, z0], [x1, y0, z0]];
    _axes.push(D33dAxis({
      className: 'axis x-axis',
      extent: extent,
      format: _formatX,
      labelAnchor: 'middle',
      labelDirection: extent,
      labelVector: [1, -5, 0],
      padding: 0,
      tickVector: [0, -1, 0],
      ticks: 6,
      title: xLabel,
      titleAnchor: 'middle',
      titleDirection: extent,
      titleVector: [2, -10, 0]
    }));

    // x axis at y1
    extent = [[x0, y1, z0], [x1, y1, z0]];
    _axes.push(D33dAxis({
      className: 'axis x-axis',
      extent: extent,
      format: _formatX,
      labelAnchor: 'middle',
      labelDirection: extent,
      labelVector: [0, 2, 0],
      padding: 0,
      tickVector: [0, 1, 0],
      ticks: 6,
      title: xLabel,
      titleAnchor: 'middle',
      titleDirection: extent,
      titleVector: [0, 8, 0]
    }));

    // y axis at x0
    extent = [[x0, y0, z0], [x0, y1, z0]];
    _axes.push(D33dAxis({
      className: 'axis y-axis',
      extent: extent,
      format: _formatY,
      labelAnchor: 'middle',
      labelDirection: extent,
      labelVector: [-2, 0, 0],
      padding: 0,
      tickVector: [-1, 0, 0],
      ticks: 6,
      title: yLabel,
      titleAnchor: 'middle',
      titleDirection: extent,
      titleVector: [-7, 2, 0]
    }));

    // y axis at x1
    extent = [[x1, y0, z0], [x1, y1, z0]];
    _axes.push(D33dAxis({
      className: 'axis y-axis',
      extent: extent,
      format: _formatY,
      labelAnchor: 'middle',
      labelDirection: extent,
      labelVector: [5, -2, 0],
      padding: 0,
      tickVector: [1, 0, 0],
      ticks: 6,
      title: yLabel,
      titleAnchor: 'middle',
      titleDirection: extent,
      titleVector: [9, -2, 0]
    }));

    // z axis
    extent = [[x0, y0, z0], [x0, y0, z1]];
    _axes.push(D33dAxis({
      className: 'axis z-axis',
      extent: extent,
      format: _formatZ,
      labelAnchor: 'middle',
      labelDirection: extent,
      labelVector: [-1.5, 0, 0],
      padding: 0,
      tickVector: [-1, 0, 0],
      ticks: 7,
      title: zLabel,
      titleAnchor: 'middle',
      titleDirection: extent,
      titleVector: [-5, 0, 0]
    }));


    // grid lines
    xTickSpacing = (x1 - x0) / xTicks;
    for (x = x0 + xTickSpacing; x < x1; x += xTickSpacing) {
      _axes.push(D33dPath({
        className: 'grid-line',
        close: false,
        coords: [[x, y0, z0], [x, y1, z0]]
      }));
    }

    yTickSpacing = (y1 - y0) / yTicks;
    for (y = y0 + yTickSpacing; y < y1; y += yTickSpacing) {
      _axes.push(D33dPath({
        className: 'grid-line',
        close: false,
        coords: [[x0, y, z0], [x1, y, z0]]
      }));
    }
  };

  /**
   * Format x-axis {distance} labels.
   *
   * @param c {Array<Number>}
   *        tick coordinate.
   * @return {String}
   *         formatted coordinate.
   */
  _formatX = function (c) {
    var x;
    x = c[0] / _xScale;
    if (x === 0) {
      return '';
    }
    return '' + x;
  };

  /**
   * Format y-axis (magnitude) labels.
   *
   * @param c {Array<Number>}
   *        tick coordinate.
   * @return {String}
   *         formatted coordinate.
   */
  _formatY = function (c) {
    var y;
    y = c[1] / _yScale;
    if (y === 0) {
      return '';
    }
    return '' + y;
  };

  /**
   * Format z-axis (percent contribution) labels.
   *
   * @param c {Array<Number>}
   *        tick coordinate.
   * @return {String}
   *         formatted coordinate.
   */
  _formatZ = function (c) {
    var z;
    z = c[2] / _zScale;
    if (z === 0) {
      return '';
    }
    return '' + z;
  };

  /**
   * Custom legend rendering function for wrapped D33dView.
   *
   * @param info {Object}
   *        rendering information.
   * @param info.el {SVGElement}
   *        element where legend should be rendered.
   */
  _renderLegend = function (info) {
    var bbox,
        el,
        legendEl,
        metadata,
        z,
        εbins;

    legendEl = info.el;

    // clear legend
    Util.empty(legendEl);
    if (!_this.model) {
      return;
    }

    // plot epsilon bins
    z = 0;
    el = d3.select(legendEl)
        .append('g')
        .attr('class', 'legend-content')
        .attr('class', 'D33dDeaggregationBin');

    metadata = _this.model.get('metadata');
    εbins = metadata.εbins;
    εbins.forEach(function (bin, index) {
      var binEl,
          text,
          textEl;

      text = 'ε = ' +
          (bin.min === null ? '(-∞' : '[' + bin.min) +
          ', ' +
          (bin.max === null ? '+∞' : bin.max) + ')';

      binEl = el.append('g')
          .attr('data-bin-index', index)
          .attr('transform', 'translate(0 ' + z + ')');
      binEl.append('path')
          .attr('d', 'M0,2' +
              'L10,2' +
              'L10,-8' +
              'L0,-8' +
              'Z');
      textEl = binEl.append('text')
          .attr('x', 15)
          .text(text);
      z += D3Util.getBBox(binEl.node()).height;
    });

    bbox = D3Util.getBBox(el.node());
    el.attr('transform',
        'translate(' + (-bbox.width) + ' 0)');
  };

  /**
   * Update displayed data.
   *
   * When a model is selected, bins are plotted on the graph.
   * Otherwise, any existing bins are destroyed and removed from the graph.
   */
  _this.render = function () {
    var εbins;

    // clean up old views
    _bins.forEach(function (v) {
      v.destroy();
    });

    // create new views
    _bins = [];
    if (_this.model) {
      εbins = Collection(_this.model.get('metadata').εbins);
      _this.model.get('data').forEach(function (bin) {
        var view;
        view = D33dDeaggregationBin({
          bin: bin,
          xScale: _xScale,
          yScale: _yScale,
          zScale: _zScale,
          εbins: εbins
        });
        _bins.push(view);
      });
    }

    // update plot
    _d33d.views.reset([]
        .concat(_axes)
        .concat(_bins));
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = DeaggregationGraphView;
