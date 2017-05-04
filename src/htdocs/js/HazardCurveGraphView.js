'use strict';

var Collection = require('mvc/Collection'),
    d3 = require('d3'),
    D3View = require('d3/D3View'),
    HazardCurveLineView = require('./HazardCurveLineView'),
    TimeHorizonLineView = require('./TimeHorizonLineView'),
    Util = require('util/Util');


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
 * @param options.yLines {Array<Object>}
 *        lines to show as annotations.
 *        each line object should have these properties:
 *          line.classes {Array<String>} classes to add to line.
 *          line.label {String} label for line.
 *          line.value {Number} y value for line.
 */
var HazardCurveGraphView = function (options) {
  var _this,
      _initialize;


  _this = D3View(Util.extend({
    xLabel: 'Ground Motion (g)',
    yLabel: 'Annual Frequency of Exceedence'
  }, options));

  _initialize = function (options) {
    _this.el.classList.add('HazardCurveGraphView');

    _this.model.set({
      legendOffset: 10,
      legendPosition: 'bottomleft',
      timeHorizon: 2475,
      xAxisScale: d3.scale.log(),
      xAxisTicks: _this.getTicks,
      yAxisScale: d3.scale.log(),
      yAxisTicks: _this.getTicks
    }, {silent: true});

    // set defaults
    options = options || {};

    // HazardCurve collection
    _this.curves = options.curves;
    _this.destroyCurves = false;
    if (!_this.curves) {
      _this.curves = Collection();
      _this.destroyCurves = true;
    }
    _this.curves.on('add', 'onAdd', _this);
    _this.curves.on('deselect', 'onDeselect', _this);
    _this.curves.on('remove', 'onRemove', _this);
    _this.curves.on('reset', 'onReset', _this);
    _this.curves.on('select', 'onSelect', _this);
    _this.views.on('select', 'onViewSelect', _this);
    _this.views.on('deselect', 'onViewDeselect', _this);

    _this.timeHorizon = TimeHorizonLineView({
      el: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
      view: _this
    });
    _this.curves.reset(_this.curves.data());
  };

  /**
   * Unbind event listeners and free references.
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    if (_this.destroyCurves) {
      _this.curves.destroy();
    } else {
      _this.curves.off('add', 'onAdd', _this);
      _this.curves.off('deselect', 'onDeselect', _this);
      _this.curves.off('remove', 'onRemove', _this);
      _this.curves.off('reset', 'onReset', _this);
      _this.curves.off('select', 'onSelect', _this);
    }

    _this.views.off('select', 'onViewSelect', _this);
    _this.views.off('deselect', 'onViewDeselect', _this);

    _this.timeHorizon.destroy();

    _this = null;
  }, _this.destroy);

  _this.getLegendClass = function () {
    return 'legend-content HazardCurveGraphView-legend';
  };

  /**
   * Get axis ticks for log based scales.
   *
   * @param extent {Array<Number>}
   *        axis extents.
   * @return {Array<Number}
   *         padded extent.
   */
  _this.getTicks = function (extent) {
    var base,
        baseLog,
        end,
        i,
        start,
        ticks,
        value;

    // convert min/max to base 10
    base = 10;
    baseLog = Math.log(base);
    start = parseInt(Math.log(extent[0])/baseLog, 10) - 1;
    end = parseInt(Math.log(extent[1])/baseLog, 10) + 1;
    ticks = [];
    for (i = start; i < end; i++) {
      value = Math.pow(base, i);
      if (value > extent[0] && value < extent[1]) {
        ticks.push(value);
      }
    }
    return ticks;
  };
  /**
   * Set default extent if there is no data.
   */
  _this.getXExtent = Util.compose(_this.getXExtent, function (extent) {
    var min = null,
        max = null;
    if (extent) {
      min = extent[0];
      max = extent[extent.length - 1];
    }
    if (!extent || isNaN(min) || isNaN(max) || min === max) {
      extent = [1E-3, 3];
    }
    return extent;
  });

  /**
   * Set default extent if there is no data.
   */
  _this.getYExtent = Util.compose(_this.getYExtent, function (extent) {
    var min = null,
        max = null;
    if (extent) {
      min = extent[0];
      max = extent[extent.length - 1];
    }
    if (!extent || isNaN(min) || isNaN(max) || min === max) {
      extent = [1E-6, 1E-1];
    }
    return extent;
  });

  /**
   * Curve add handler.
   *
   * @param curves {Array<HazardCurve>}
   *        curves that were added.
   */
  _this.onAdd = function (curves) {
    // add time horizon view as first line
    if (_this.views.data().length === 0 && curves.length > 0) {
      _this.views.add(_this.timeHorizon);
    }

    curves.forEach(function (curve) {
      var view = HazardCurveLineView(Util.extend({
        view: _this
      }, curve.get()));
      view.id = curve.id;
      _this.views.add(view);
    });
  };

  _this.onClick = function (view) {
    var curve;

    if (_this.model.get('clickToSelect') &&
        view !== _this.timeHorizon) {

      curve = _this.curves.get(view.id);
      if (curve) {
        _this.curves.select(curve);
      } else {
        _this.curves.deselect();
      }
    }
  };

  /**
   * Curve deselect handler.
   */
  _this.onDeselect = function () {
    _this.views.deselect();
  };

  /**
   * Curve remove handler.
   *
   * @param curves {Array<HazardCurve>}
   *        curves that were removed.
   */
  _this.onRemove = function (curves) {
    var toRemove = [];
    curves.forEach(function (curve) {
      var view = _this.views.get(curve.id);
      if (view) {
        toRemove.push(view);
      }
    });
    _this.views.remove.apply(_this.views, toRemove);
    // remove time horizon if only line
    if (_this.views.data().length === 1) {
      _this.views.remove(_this.timeHorizon);
    }
  };

  /**
   * Curve reset handler.
   */
  _this.onReset = function () {
    _this.views.reset([]);
    _this.onAdd(_this.curves.data());
  };

  /**
   * Curve select handler.
   */
  _this.onSelect = function (curve) {
    _this.views.selectById(curve.id);
  };

  /**
   * View deselect handler.
   *
   * Deselects curve in curves collection.
   */
  _this.onViewDeselect = function () {
    _this.curves.deselect();
  };

  /**
   * View select handler.
   *
   * Selects the corresponding curve in the curves collection.
   */
  _this.onViewSelect = function () {
    _this.curves.selectById(_this.views.getSelected().id);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = HazardCurveGraphView;
