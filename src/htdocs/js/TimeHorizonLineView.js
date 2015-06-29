'use strict';


var D3LineView = require('d3/D3LineView'),
    Util = require('util/Util');


/**
 * Draw a time horizon line on a HazardCurveGraphView.
 *
 * Expectes a "timeHorizon" model property that is a number > 0.
 */
var TimeHorizonLineView = function (options) {
  var _this;

  // extend D3LineView
  _this = D3LineView(Util.extend({
    showPoints: false
  }, options));

  /**
   * Destroy this view.
   */
  _this.destroy = Util.compose(function () {
    _this = null;
  }, _this.destroy);

  _this.getXExtent = function () {
    return [];
  };

  _this.getYExtent = function () {
    return [];
  };

  _this.render = Util.compose(function (changed) {
    var timeHorizon = _this.view.model.get('timeHorizon'),
        xExtent = _this.view.getXExtent(),
        afe,
        data;

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


  options = null;
  return _this;
};


module.exports = TimeHorizonLineView;
