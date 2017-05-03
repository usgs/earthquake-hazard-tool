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
 * @param options.bounds {Array<Array>}
 *        default null.
 *        plotting bounds.
 *        can be changed later by setting VIEW.bounds and calling VIEW.render
 * @param options.collection {Collection<Deaggregation>}
 *        collection with data to display.
 *        selected Deaggregation object is displayed.
 */
var DeaggregationGraphView = function (options) {
  var _this,
      _initialize;


  _this = SelectedCollectionView(options);


  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _this.el.innerHTML = '<div class="DeaggregationGraphView"></div>';

    _this.bounds = options.bounds || null;

    _this.axes = [];
    _this.bins = [];

    _this.xScale = 2;
    _this.yScale = 25;
    _this.zScale = 2;

    _this.xTickSpacing = 5;
    _this.yTickSpacing = 0.5;
    _this.zTickSpacing = 5;

    _this.d33d = D33dView({
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
      zoom: 3.5
    });
    _this.d33d.renderLegend = _this.renderLegend;

    _this.render();
  };


  /**
   * Use data extents to set view lookAt, origin, and zoom so plot is
   * roughly centered within view plot area.
   */
  _this.centerView = function () {
    var bounds,
        lookAt,
        origin,
        projectedBounds,
        projectedWidth,
        projectedHeight,
        x0,
        x1,
        y0,
        y1,
        z0,
        z1,
        zoom;

    // get current view
    lookAt = _this.d33d.model.get('lookAt');
    origin = _this.d33d.model.get('origin');
    zoom = _this.d33d.model.get('zoom');

    // compute projected bounds
    bounds = _this.getBounds();
    _this.xScale = 100 / (bounds[1][0] - bounds[0][0]);
    _this.yScale = 70 / (bounds[1][1] - bounds[0][1]);
    _this.zScale = 50 / (bounds[1][2] - bounds[0][2]);
    x0 = bounds[0][0] * _this.xScale;
    x1 = bounds[1][0] * _this.xScale;
    y0 = bounds[0][1] * _this.yScale;
    y1 = bounds[1][1] * _this.yScale;
    z0 = bounds[0][2] * _this.zScale;
    z1 = bounds[1][2] * _this.zScale;

    projectedBounds = [
      [x0, y0, z0],
      [x0, y1, z0],
      [x1, y1, z0],
      [x1, y0, z0],
      [x0, y0, z1],
      [x0, y1, z1],
      [x1, y1, z1],
      [x1, y0, z1]
    ].map(_this.d33d.project).reduce(function (bounds, point) {
      var x,
          y,
          z;

      x = point[0];
      y = point[1];
      z = point[2];

      if (x < bounds[0][0]) {
        bounds[0][0] = x;
      }
      if (x > bounds[1][0]) {
        bounds[1][0] = x;
      }
      if (y < bounds[0][1]) {
        bounds[0][1] = y;
      }
      if (y > bounds[1][1]) {
        bounds[1][1] = y;
      }
      if (z < bounds[0][2]) {
        bounds[0][2] = z;
      }
      if (z > bounds[1][2]) {
        bounds[1][2] = z;
      }

      return bounds;
    }, [
      [
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY
      ],
      [
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY
      ]
    ]);

    projectedWidth = (projectedBounds[1][0] - projectedBounds[0][0]);
    projectedHeight = (projectedBounds[1][1] - projectedBounds[0][1]);

    // look at x/y center at z=z0
    lookAt = [
      0.95 * (x1 + x0) / 2,
      0.95 * (y1 + y0) / 2,
      -5 * _this.zScale
    ];
    origin = [
      lookAt[0] + 1000,
      lookAt[1] - 1000,
      lookAt[2] + 1000
    ];
    zoom = Math.min(
        480 * zoom / projectedWidth,
        480 * zoom / projectedHeight
    );

    _this.d33d.model.set({
      'lookAt': lookAt,
      'origin': origin,
      'zoom': zoom
    });
  };

  /**
   * Create axes to be plotted.
   *
   * TODO: eliminate "magic" numbers.
   * Extents and tick, label, and title, vectors arre hard coded and work for
   * the current lookAt, origin, and zoom, combination.
   */
  _this.createAxes = function () {
    var bounds,
        extent,
        gridSpacing,
        metadata,
        x,
        x0,
        x1,
        xLabel,
        xTicks,
        y,
        y0,
        y1,
        yLabel,
        yTicks,
        z0,
        z1,
        zLabel,
        zTicks;

    bounds = _this.getBounds();
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

    //_this.yScale = 100 / (y1 - y0);
    //_this.zScale = 100 / (z1 - z0);

    xLabel = metadata.rlabel;
    xTicks = ((x1 - x0) / _this.xTickSpacing);
    while (xTicks > 10) {
      xTicks = xTicks / 2;
    }

    yLabel = metadata.mlabel;
    yTicks = ((y1 - y0) / _this.yTickSpacing);
    zLabel = metadata.εlabel;
    zTicks = ((z1 - z0) / _this.zTickSpacing);

    x0 = x0 * _this.xScale;
    x1 = x1 * _this.xScale;
    y0 = y0 * _this.yScale;
    y1 = y1 * _this.yScale;
    z0 = z0 * _this.zScale;
    z1 = z1 * _this.zScale;

    // x axis at y0
    extent = [[x0, y0, z0], [x1, y0, z0]];
    _this.axes.push(D33dAxis({
      className: 'axis x-axis',
      extent: extent,
      format: _this.formatX,
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
    _this.axes.push(D33dAxis({
      className: 'axis x-axis',
      extent: extent,
      format: _this.formatX,
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
    _this.axes.push(D33dAxis({
      className: 'axis y-axis',
      extent: extent,
      format: _this.formatY,
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
    _this.axes.push(D33dAxis({
      className: 'axis y-axis',
      extent: extent,
      format: _this.formatY,
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
    _this.axes.push(D33dAxis({
      className: 'axis z-axis',
      extent: extent,
      format: _this.formatZ,
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
    gridSpacing = _this.xTickSpacing * _this.xScale;
    while ((x1 - x0) / gridSpacing > 10) {
      gridSpacing = gridSpacing * 2;
    }

    for (x = x0 + gridSpacing; x < x1; x += gridSpacing) {
      _this.axes.push(D33dPath({
        className: 'grid-line',
        close: false,
        coords: [[x, y0, z0], [x, y1, z0]]
      }));
    }

    gridSpacing = _this.yTickSpacing * _this.yScale;
    for (y = y0 + gridSpacing; y < y1; y += gridSpacing) {
      _this.axes.push(D33dPath({
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
  _this.formatX = function (c) {
    var x;
    x = c[0] / _this.xScale;
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
  _this.formatY = function (c) {
    var y;
    y = c[1] / _this.yScale;
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
  _this.formatZ = function (c) {
    var z;
    z = c[2] / _this.zScale;
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
  _this.getBounds = function () {
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
      bounds = _this.bounds;
      if (!bounds) {
        bounds = __calculateBounds(_this.model.get('data'));
      }

      x0 = bounds[0][0];
      x1 = bounds[1][0];
      y0 = bounds[0][1];
      y1 = bounds[1][1];
      z0 = bounds[0][2];
      z1 = bounds[1][2];
    }

    // round min/max down/up to an increment of 10
    x0 = _this.xTickSpacing * Math.floor(x0 / _this.xTickSpacing) -
        _this.xTickSpacing;
    x1 = _this.xTickSpacing * Math.ceil(x1 / _this.xTickSpacing) +
        _this.xTickSpacing;

    // round min/max down/up to next whole unit
    y0 = _this.yTickSpacing * Math.floor(y0 / _this.yTickSpacing) -
        _this.yTickSpacing;
    y1 = _this.yTickSpacing * Math.ceil(y1 / _this.yTickSpacing) +
        _this.yTickSpacing;

    // always use 0
    z0 = 0;
    // round up to increment of 10
    z1 = _this.zTickSpacing * Math.ceil(z1 / _this.zTickSpacing) +
        _this.zTickSpacing;


    return [[x0, y0, z0], [x1, y1, z1]];
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

    oldBins = _this.bins;
    oldAxes = _this.axes;

    _this.centerView();

    // create new views
    _this.axes = [];
    _this.createAxes();

    _this.bins = [];
    if (_this.model) {
      εbins = Collection(_this.model.get('metadata').εbins);
      _this.model.get('data').forEach(function (bin) {
        var view;
        view = D33dDeaggregationBin({
          bin: bin,
          xScale: _this.xScale,
          yScale: _this.yScale,
          zScale: _this.zScale,
          εbins: εbins
        });
        _this.bins.push(view);
      });
    }


    // update plot
    _this.d33d.views.reset([]
        .concat(_this.axes)
        .concat(_this.bins));

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

  /**
   * Custom legend rendering function for wrapped D33dView.
   *
   * @param info {Object}
   *        rendering information.
   * @param info.el {SVGElement}
   *        element where legend should be rendered.
   */
  _this.renderLegend = function (info) {
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


  _initialize(options);
  options = null;
  return _this;
};


DeaggregationGraphView.calculateBounds = __calculateBounds;


module.exports = DeaggregationGraphView;
