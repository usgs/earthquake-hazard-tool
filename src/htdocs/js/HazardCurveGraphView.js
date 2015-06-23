'use strict';

var d3 = require('d3'),
    Collection = require('mvc/Collection'),
    D3GraphView = require('./D3GraphView'),
    HazardCurveLineView = require('./HazardCurveLineView'),
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
      _line,
      _views,
      _x,
      _xExtent,
      _y,
      _yExtent,
      _yLines,
      // methods
      _getTicks,
      _getX,
      _getY,
      _onAdd,
      _onDeselect,
      _onRemove,
      _onReset,
      _onSelect,
      _padExtent;

  _this = D3GraphView(options);

  _initialize = function (options) {
    _this.model.set({
      xAxisScale: d3.scale.log(),
      xAxisTicks: _getTicks,
      yAxisScale: d3.scale.log(),
      yAxisTicks: _getTicks
    }, {silent: true});

    // set defaults
    options = options || {};
    // parse options
    _curves = options.curves || Collection();
    _views = Collection();
    _yLines = options.yLines || [
      {
        anchor: 'right',
        classes: ['rate', 'rate-2p50'],
        label: '2% in 50 years',
        value: -Math.log(0.98) / 50
      },
      {
        anchor: 'right',
        classes: ['rate', 'rate-10p50'],
        label: '10% in 50 years',
        value: -Math.log(0.90) / 50
      }
    ];
    _xExtent = null;
    _yExtent = null;
    _this.el.classList.add('HazardCurveGraph');

    _curves.on('add', _onAdd);
    _curves.on('deselect', _onDeselect);
    _curves.on('remove', _onRemove);
    _curves.on('reset', _onReset);
    _curves.on('select', _onSelect);
    _this.curves = _curves;

    _line = d3.svg.line();
    _line.x(_getX);
    _line.y(_getY);

    _yLines.forEach(function (y) {
      var el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      if (y.classes) {
        el.setAttribute('class', y.classes.join(' '));
      }
      y.el = d3.select(el);
      y.textEl = y.el.append('text')
          .attr('text-anchor', y.anchor || 'left')
          .attr('x', 0)
          .attr('y', 0)
          .attr('dy', '1em')
          .text(y.label);
      y.pathEl = y.el.append('path');
    });
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

  _getX = function (d) {
    return _x(d[0]);
  };

  _getY = function (d) {
    return _y(d[1]);
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
    var el,
        view;

    el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    view = HazardCurveLineView({
      model: curve,
      el: el,
      graph: _this
    });
    // add to collection
    view.id = curve.id;
    _views.add(view);

    // click on curve to trigger select
    view._onClick = function () {
      _curves.select(curve);
    };
    el.addEventListener('click', view._onClick);

    // augment destroy method
    view.destroy = Util.compose(function () {
      el.removeEventListener('click', view._onClick);
      view._onClick = null;
    }, view.destroy);

    _xExtent = null;
    _yExtent = null;

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
    _views.get(curve.id).el.classList.remove('selected');
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
    view.destroy();

    _xExtent = null;
    _yExtent = null;
  };

  /**
   * Collection "reset" event handler.
   *
   * @param data {Array<HazardCurve>}.
   *        new collection objects.
   */
  _onReset = function (data) {
    _views.data().forEach(function (v) {
      v.destroy();
    });
    _xExtent = null;
    _yExtent = null;
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
    _views.get(curve.id).el.classList.add('selected');
  };

  /**
   * Pad a log based extent.
   *
   * @param extent {Array<Number>}
   *        axis extents.
   * @return {Array<Number}
   *         padded extent.
   */
  _padExtent = function (extent) {
    var base,
        baseLog,
        end,
        pad,
        start;

    // convert min/max to base 10
    base = 10;
    baseLog = Math.log(base);
    start = Math.log(extent[0]) / baseLog;
    end = Math.log(extent[1]) / baseLog;
    pad = (end - start) * 0.05;
    return [Math.pow(base, start - pad), Math.pow(base, end + pad)];
  };

  /**
   * Unbind event listeners and free references.
   */
  _this.destroy = Util.compose(function () {

    _curves.off('add', _onAdd);
    _curves.off('deselect', _onDeselect);
    _curves.off('remove', _onRemove);
    _curves.off('reset', _onReset);
    _curves.off('select', _onSelect);
    _curves = null;
  }, _this.destroy);

  /**
   * Get the X extent.
   *
   * @return {Array<Number>} the X extent for all curves.
   */
  _this.getXExtent = function () {
    if (_xExtent !== null) {
      return _xExtent;
    }
    _xExtent = [];
    _views.data().forEach(function (v) {
      _xExtent = _xExtent.concat(v.xExtent);
    });
    _xExtent = d3.extent(_xExtent);
    _xExtent = _padExtent(_xExtent);
    return _xExtent;
  };

  /**
   * Get the Y extent.
   *
   * @return {Array<Number>} the Y extent for all curves.
   */
  _this.getYExtent = function () {
    if (_yExtent !== null) {
      return _yExtent;
    }
    _yExtent = [];
    _views.data().forEach(function (v) {
      _yExtent = _yExtent.concat(v.yExtent);
    });
    _yExtent = d3.extent(_yExtent);
    _yExtent[0] = Math.max(_yExtent[0], 1e-13);
    _yExtent = _padExtent(_yExtent);
    return _yExtent;
  };

  /**
   * Draw/update the graph.
   */
  _this.plot = function () {
    var dataEl = _this.dataEl,
        views = _views.data();

    // clear the plot
    Util.empty(dataEl);

    if (views.length === 0) {
      // no scale information available
      return;
    }

    // make sure using current scale
    _x = _this.model.get('xAxisScale');
    _y = _this.model.get('yAxisScale');

    _yLines.forEach(function (y) {
      var x;

      // getBBox doesn't work until attached
      el.appendChild(y.el.node());

      // plot line at top
      y.pathEl.attr('d', _line([
        [_xExtent[0], y.value],
        [_xExtent[1], y.value]
      ]));

      if (y.anchor && y.anchor !== 'left') {
        x = _x(_xExtent[1]);
        if (y.anchor === 'middle') {
          x = x / 2;
        } else {
          // right, position at right edge
          x = x - y.textEl.node().getBBox().width;
        }
        y.textEl.attr('x', x);
      }
      // position text and line at y value
      y.textEl.attr('y', _y(y.value));
    });

    // add curves
    views.forEach(function (v) {
      el.appendChild(v.el);
      v.render();
    });
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = HazardCurveGraphView;
