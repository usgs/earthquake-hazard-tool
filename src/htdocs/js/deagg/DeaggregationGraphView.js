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
 * Calculate deaggregation data bounds.
 *
 * @param bindata {Array<Bin>}
 *     array of deaggregation bins
 *     where Bin is an Object:
 *       bin.r {Number}
 *             distance to bin (x-axis)
 *       bin.m {Number}
 *             magnitude of bin (y-axis)
 *       bin.εdata {Array<Object>}
 *             array of epsilon data for bin (z-axis)
 *             Each Object has properties:
 *               εdata.value {Number}
 *                           % contribution to hazard
 *               εdata.εbin {Number}
 *                          id of epsilon bin.
 *
 * @return {Array<Array<x0,y0,z0>, Array<x1,y1,z1>}
 *         bounds of deaggregation data.
 *         Array contains two sub arrays,
 *         containing minimum and maximum values for each axis.
 */
var __calculateBounds = function (bindata) {
  var x0,
      x1,
      y0,
      y1,
      z0,
      z1;

  // start with values that will always be smaller/larger than actual values
  x0 = y0 = z0 = Number.POSITIVE_INFINITY;
  x1 = y1 = z1 = Number.NEGATIVE_INFINITY;

  bindata.forEach(function (bin) {
    var binx,
        biny,
        binz;

    binx = bin.r;
    biny = bin.m;
    // sum values for z
    binz = 0;
    bin.εdata.forEach(function (εval) {
      binz = binz + εval.value;
    });

    // track min/max
    if (binx < x0) {
      x0 = binx;
    }
    if (binx > x1) {
      x1 = binx;
    }
    if (biny < y0) {
      y0 = biny;
    }
    if (biny > y1) {
      y1 = biny;
    }
    if (binz < z0) {
      z0 = binz;
    }
    if (binz > z1) {
      z1 = binz;
    }
  });

  // return bounds
  return [[x0, y0, z0], [x1, y1, z1]];
};


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
      _getBounds,
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
        60,
        125,
        10
      ],
      origin: [
        280,
        -150,
        180
      ],
      up: [0, 0, 1],
      zoom: 4
    });
    _d33d.renderLegend = _renderLegend;

    _createAxes();

    _this.render();
  };

  /**
   * Create axes to be plotted.
   *
   * TODO: eliminate "magic" numbers.
   * Extents and tick, label, and title, vectors arre hard coded and work for
   * the current lookAt, origin, and zoom, combination.
   */
  _createAxes = function () {
    var bounds,
        extent,
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
        zLabel,
        zTickSpacing,
        zTicks;

    bounds = _getBounds();
    x0 = bounds[0][0];
    x1 = bounds[1][0];
    y0 = bounds[0][1];
    y1 = bounds[1][1];
    z0 = bounds[0][2];
    z1 = bounds[1][2];

    if (_this.model) {
      metadata = _this.model.get('metadata');
    } else {
      metadata = {};
    }

    _xScale = 100 / (x1 - x0);
    //_yScale = 100 / (y1 - y0);
    //_zScale = 100 / (z1 - z0);

    xLabel = metadata.rlabel;
    xTickSpacing = 5;
    xTicks = ((x1 - x0) / xTickSpacing);
    if (xTicks > 10) {
      xTicks = xTicks / 2;
      xTickSpacing = 10;
    }
    yLabel = metadata.mlabel;
    yTickSpacing = 0.5;
    yTicks = ((y1 - y0) / yTickSpacing);
    zLabel = metadata.εlabel;
    zTickSpacing = 5;
    zTicks = ((z1 - z0) / zTickSpacing);

    x0 = x0 * _xScale;
    x1 = x1 * _xScale;
    y0 = y0 * _yScale;
    y1 = y1 * _yScale;
    z0 = z0 * _zScale;
    z1 = z1 * _zScale;

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
      ticks: xTicks,
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
      ticks: xTicks,
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
      ticks: yTicks,
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
      ticks: yTicks,
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
      ticks: zTicks,
      title: zLabel,
      titleAnchor: 'middle',
      titleDirection: extent,
      titleVector: [-5, 0, 0]
    }));


    // grid lines
    for (x = x0 + xTickSpacing; x < x1; x += xTickSpacing) {
      _axes.push(D33dPath({
        className: 'grid-line',
        close: false,
        coords: [[x, y0, z0], [x, y1, z0]]
      }));
    }

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
    return '' + Number(x.toPrecision(3));
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
    return '' + Number(y.toPrecision(3));
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
    return '' + Number(z.toPrecision(3));
  };

  /**
   * Get data bounds for plotting.
   *
   * @return {Array<Array<x0,y0,z0>, Array<x1,y1,z1>}
   *         bounds of deaggregation data.
   *         Array contains two sub arrays,
   *         containing minimum and maximum values for each axis.
   */
  _getBounds = function () {
    var bounds,
        x0,
        x1,
        y0,
        y1,
        z0,
        z1;

    // default bounds
    x0 = 0;
    x1 = 100;
    y0 = 5;
    y1 = 8;
    z0 = 0;
    z1 = 35;

    if (_this.model) {
      bounds = _this.model.get('bounds');
      if (!bounds) {
        bounds = __calculateBounds(_this.model.get('data'));
      }

      x0 = bounds[0][0];
      x1 = bounds[1][0];
      y0 = bounds[0][1];
      y1 = bounds[1][1];
      z0 = bounds[0][2];
      z1 = bounds[1][2];

      // round min/max down/up to an increment of 10
      x0 = 10 * Math.floor(x0 / 10);
      x1 = 10 * Math.ceil(x1 / 10);

      // round min/max down/up to next whole unit
      y0 = Math.floor(y0) - 0.5;
      y1 = Math.ceil(y1) + 0.5;

      // always use 0
      z0 = 0;
      // round up to increment of 10
      z1 = 10 * Math.ceil(z1 / 10.0);
    }

    return [[x0, y0, z0], [x1, y1, z1]];
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
          ' .. ' +
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
    var oldAxes,
        oldBins,
        εbins;

    oldBins = _bins;
    oldAxes = _axes;

    // create new views
    _axes = [];
    _createAxes();

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

    // clean up old views
    oldAxes.forEach(function (a) {
      a.destroy();
    });

    oldBins.forEach(function (v) {
      v.destroy();
    });

    oldAxes = null;
    oldBins = null;
  };


  _initialize(options);
  options = null;
  return _this;
};


DeaggregationGraphView.calculateBounds = __calculateBounds;


module.exports = DeaggregationGraphView;
