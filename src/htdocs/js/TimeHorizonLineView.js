'use strict';


var D3LineView = require('d3/D3LineView'),
    Util = require('util/Util');


/**
 * Draw a time horizon line on a HazardCurveGraphView.
 *
 * Expectes a "timeHorizon" model property that is a number > 0.
 */
var TimeHorizonLineView = function (params) {
  var _this,
      _initialize;


  // extend D3LineView
  _this = D3LineView(Util.extend({
    showPoints: false,
    showLegendPoint: false
  }, params));

  _initialize = function (/*params*/) {
    _this.el.classList.add('TimeHorizonLineView');
  };


  /**
   * Destroy this view.
   */
  _this.destroy = Util.compose(function () {
    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.getXExtent = function () {
    return [];
  };

  _this.getYExtent = function () {
    return [];
  };

  _this.onPointOut = function () {
    console.log('onPointOut');
    // ... do nothing ...
  };

  _this.onPointOver = function () {
    console.log('onPointOver');
    // ... do nothing ...
  };

  _this.render = Util.compose(function (changed) {
    var afe,
        data,
        timeHorizon,
        xExtent;

    timeHorizon = _this.view.model.get('timeHorizon');
    xExtent = _this.view.getPlotXExtent(_this.view.getXExtent());

    if (isNaN(xExtent[0])) {
      data = [];
    } else {
      afe = 1 / timeHorizon;
      data = [[xExtent[0], afe], [xExtent[1], afe]];
    }

    _this.model.set({
      label: 'Time Horizon ' + timeHorizon + ' years',
      data: data
    }, {silent: true});
    return changed;
  }, _this.render);


  _initialize(params);
  params = null;
  return _this;
};


module.exports = TimeHorizonLineView;
