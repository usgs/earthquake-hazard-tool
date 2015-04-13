'use strict';

var d3 = require('d3'),
    Collection = require('mvc/Collection'),
    D3GraphView = require('./D3GraphView'),
    HazardCurveLineView = require('./HazardCurveLineView'),
    Util = require('util/Util');


var DEFAULTS = {
  curves: null
};


/**
 * Display a HazardCurve as a Graph
 *
 * HazardCurveGraphView.curves is a Collection that can be updated to add,
 * remove, or select curves being displayed.  When curves are clicked in this
 * view, they are selected in this collection.
 *
 * @param options {Object}
 *        all options are passed to D3GraphView.
 * @param options.curves {Array|Collection}
 *        curves to display.
 */
var HazardCurveGraphView = function (options) {
  var _this,
      _initialize,
      // variables
      _curves,
      _curvesEl,
      _initialized,
      _tooltip,
      _views,
      _x,
      _xAxis,
      _xAxisEl,
      _y,
      _yAxis,
      _yAxisEl,
      // methods
      _onAdd,
      _onDeselect,
      _onRemove,
      _onReset,
      _onSelect;

  _this = D3GraphView(options);

  _initialize = function (options) {
    var plotArea = _this.plotArea;

    _initialized = false;

    // set defaults
    options = Util.extend({}, DEFAULTS, options);
    // parse options
    _curves = options.curves || Collection();
    _views = Collection();

    _this.el.classList.add('HazardCurveGraph');

    _xAxis = d3.svg.axis()
        .orient('bottom')
        .ticks(8, function (x) {
          return x;
        });
    _xAxisEl = plotArea.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + _this.height + ')');
    _yAxis = d3.svg.axis()
        .orient('left');
    _yAxisEl = plotArea.append('svg:g')
        .attr('class', 'y axis');
    _curvesEl = plotArea.append('svg:g')
        .attr('class', 'curves');

    _tooltip = plotArea.append('svg:g')
        .attr('class', 'tooltip');

    _this.setScales(d3.scale.log(), d3.scale.log());

    _curves.on('add', _onAdd);
    _curves.on('deselect', _onDeselect);
    _curves.on('remove', _onRemove);
    _curves.on('reset', _onReset);
    _curves.on('select', _onSelect);
    _this.curves = _curves;

    _initialized = true;
  };

  /**
   * Collection "add" event handler.
   *
   * @param curve {HazardCurve}
   *        curve being added.
   * @param dontrender {Boolean}
   *        default false.
   *        calls render unless this is "true".
   *        used for batch updates.
   */
  _onAdd = function (curve, dontrender) {
    var el = _curvesEl.append('svg:g');

    var view = HazardCurveLineView({
      curve: curve,
      el: el,
      tooltip: _tooltip,
      xScale: _x,
      yScale: _y
    });

    // click on curve to trigger select
    el.on('click', function () {
      _curves.select(curve);
    });

    view.id = curve.id;
    _views.add(view);

    if (!dontrender) {
      _this.render();
    }
  };

  /**
   * Collection "deselect" event handler.
   *
   * @param curve {HazardCurve}
   *        curve that is no longer selected.
   */
  _onDeselect = function (curve) {
    _views.get(curve.id).el.node().classList.remove('selected');
  };

  /**
   * Collection "remove" event handler.
   *
   * @param curve {HazardCurve}
   *        curve that was removed.
   */
  _onRemove = function (curve) {
    var view = _views.get(curve.id);
    _views.remove(view);

    // remove click handler
    view.el.on('click', null);

    view.destroy();
  };

  /**
   * Collection "reset" event handler.
   *
   * @param data {Array<HazardCurve>}.
   *        new collection objects.
   */
  _onReset = function (data) {
    _views.data().forEach(function (v) {
      v.el.on('click', null);
      v.destroy();
    });
    _views.reset([]);
    data.forEach(function (d) {
      _onAdd(d, true);
    });
    _this.render();
  };

  /**
   * Collection "select" event handler.
   *
   * @param curve {HazardCurve}
   *        curve that was selected.
   */
  _onSelect = function (curve) {
    _views.get(curve.id).el.node().classList.add('selected');
  };

  /**
   * Update graph scales.
   *
   * @param xScale {d3.scale}
   *        scale for x axis.
   * @param yScale {d3.scale}
   *        scale for y axis.
   */
  _this.setScales = function (xScale, yScale) {
    _this.xScale = xScale;
    _this.xScale.range([0, _this.width]);

    _this.yScale = yScale;
    _this.yScale.range([_this.height, 0]);

    if (_initialized) {
      _this.render();
    }
  };

  /**
   * Unbind event listeners and free references.
   */
  _this.destroy = Util.compose(function () {
    _curves = null;
  }, _this.destroy);

  /**
   * Draw/update the graph.
   */
  _this.render = function () {
    var views = _views.data(),
        xExtent = [],
        yExtent = [];
    // find data extent
    views.forEach(function (v) {
      xExtent = xExtent.concat(v.xExtent);
      yExtent = yExtent.concat(v.yExtent);
    });
    xExtent = d3.extent(xExtent);
    yExtent = d3.extent(yExtent);
    yExtent[0] = Math.max(yExtent[0], 1e-13);
    _this.xScale.domain(xExtent);
    _this.yScale.domain(yExtent);
    // update axes
    _xAxis.scale(this.xScale);
    _xAxisEl.call(_xAxis);
    _yAxis.scale(this.yScale);
    _yAxisEl.call(_yAxis);
    // update curves
    views.forEach(function (v) {
      v.setScales(_this.xScale, _this.yScale);
      v.render();
    });
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = HazardCurveGraphView;
