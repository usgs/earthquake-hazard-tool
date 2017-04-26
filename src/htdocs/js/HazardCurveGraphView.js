'use strict';

var d3 = require('d3'),
    Collection = require('mvc/Collection'),
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
      _initialize,
      // variables
      _curves,
      _destroyCurves,
      _timeHorizon,
      // methods
      _getTicks,
      _onAdd,
      _onDeselect,
      _onRemove,
      _onReset,
      _onSelect,
      _onViewSelect,
      _onViewDeselect;

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
      xAxisTicks: _getTicks,
      yAxisScale: d3.scale.log(),
      yAxisTicks: _getTicks
    }, {silent: true});

    // set defaults
    options = options || {};

    // HazardCurve collection
    _curves = options.curves;
    _destroyCurves = false;
    if (!_curves) {
      _curves = Collection();
      _destroyCurves = true;
    }
    _curves.on('add', _onAdd);
    _curves.on('deselect', _onDeselect);
    _curves.on('remove', _onRemove);
    _curves.on('reset', _onReset);
    _curves.on('select', _onSelect);
    _this.curves = _curves;
    _this.views.on('select', _onViewSelect);
    _this.views.on('deselect', _onViewDeselect);

    _timeHorizon = TimeHorizonLineView({
      el: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
      view: _this
    });
    _this.curves.reset(_this.curves.data());
  };

  /**
   * Get axis ticks for log based scales.
   *
   * @param extent {Array<Number>}
   *        axis extents.
   * @return {Array<Number}
   *         padded extent.
   */
  _getTicks = function (extent) {
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
   * Curve add handler.
   *
   * @param curves {Array<HazardCurve>}
   *        curves that were added.
   */
  _onAdd = function (curves) {
    // add time horizon view as first line
    if (_this.views.data().length === 0 && curves.length > 0) {
      _this.views.add(_timeHorizon);
    }

    curves.forEach(function (curve) {
      var view = HazardCurveLineView(Util.extend({
        view: _this
      }, curve.get()));
      view.id = curve.id;
      _this.views.add(view);
    });
  };

  /**
   * Curve deselect handler.
   */
  _onDeselect = function () {
    _this.views.deselect();
  };

  /**
   * Curve remove handler.
   *
   * @param curves {Array<HazardCurve>}
   *        curves that were removed.
   */
  _onRemove = function (curves) {
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
      _this.views.remove(_timeHorizon);
    }
  };

  /**
   * Curve reset handler.
   */
  _onReset = function () {
    _this.views.reset([]);
    _onAdd(_curves.data());
  };

  /**
   * Curve select handler.
   */
  _onSelect = function (curve) {
    _this.views.selectById(curve.id);
  };

  /**
   * View deselect handler.
   *
   * Deselects curve in curves collection.
   */
  _onViewDeselect = function () {
    _curves.deselect();
  };

  /**
   * View select handler.
   *
   * Selects the corresponding curve in the curves collection.
   */
  _onViewSelect = function () {
    _curves.selectById(_this.views.getSelected().id);
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
   * Unbind event listeners and free references.
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    if (_destroyCurves) {
      _this.curves.destroy();
    } else {
      _curves.off('add', _onAdd);
      _curves.off('deselect', _onDeselect);
      _curves.off('remove', _onRemove);
      _curves.off('reset', _onReset);
      _curves.off('select', _onSelect);
    }
    _this.curves = null;

    _this.views.off('select', _onViewSelect);
    _this.views.off('deselect', _onViewDeselect);

    _timeHorizon.destroy();
    _timeHorizon = null;

    _onAdd = null;
    _onDeselect = null;
    _onRemove = null;
    _onReset = null;
    _onSelect = null;
    _onViewSelect = null;
    _onViewDeselect = null;
    _this = null;
  }, _this.destroy);

  _this.getLegendClass = function () {
    return 'legend-content HazardCurveGraphView-legend';
  };

  _this.onClick = function (view) {
    var curve;

    if (_this.model.get('clickToSelect') &&
        view !== _timeHorizon) {

      curve = _curves.get(view.id);
      if (curve) {
        _curves.select(curve);
      } else {
        _curves.deselect();
      }
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = HazardCurveGraphView;
