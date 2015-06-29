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
      _timeHorizon,
      // methods
      _getTicks,
      _onAdd,
      _onDeselect,
      _onRemove,
      _onReset,
      _onSelect;

  _this = D3View(options);

  _initialize = function (options) {
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
    _curves = options.curves || Collection();
    _curves.on('add', _onAdd);
    _curves.on('deselect', _onDeselect);
    _curves.on('remove', _onRemove);
    _curves.on('reset', _onReset);
    _curves.on('select', _onSelect);
    _this.curves = _curves;

    _timeHorizon = new TimeHorizonLineView({
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
    curves.forEach(function (curve) {
      var view = HazardCurveLineView({
        model: curve,
        view: _this
      });
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
  };

  /**
   * Curve reset handler.
   */
  _onReset = function () {
    _this.views.reset([_timeHorizon]);
    _onAdd(_curves.data());
  };

  /**
   * Curve select handler.
   */
  _onSelect = function (curve) {
    _this.views.selectById(curve.id);
  };

  /**
   * Unbind event listeners and free references.
   */
  _this.destroy = Util.compose(function () {
    _this.curves.destroy();
    _this.curves = null;

    _timeHorizon.destroy();
    _timeHorizon = null;
  }, _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = HazardCurveGraphView;
