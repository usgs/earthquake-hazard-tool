'use strict';


var HazardCurveLineView = require('./HazardCurveLineView'),
    Model = require('mvc/Model'),
    Util = require('util/Util');


/**
 * Draw a time horizon line on a HazardCurveGraphView.
 *
 * Expectes a "timeHorizon" model property that is a number > 0.
 */
var TimeHorizonLineView = function (options) {
  var _this,
      _initialize,
      _onChange;

  // extend HazardCurveLineView
  _this = HazardCurveLineView(Util.extend(
      {
        model: Model({
          data: [],
          showPoints: false
        })
      },
      options));

  /**
   * Initialize view.
   */
  _initialize = function () {
    _this.model.on('change:timeHorizon', _onChange);
    // this second binding is not really needed, because graph view
    // currently sets both timeHorizon and xExtent at the same time
    //_this.model.on('change:xExtent', _onChange);
  };

  /**
   * Model change listener for timeHorizon.
   *
   * Updates label, and line data based on time horizon value.
   */
  _onChange = function () {
    var timeHorizon = _this.model.get('timeHorizon'),
        xExtent = _this.model.get('xExtent'),
        afe = 1 / timeHorizon;

    _this.model.set({
      label: 'Time Horizon ' + timeHorizon + ' years',
      data: [[xExtent[0], afe], [xExtent[1], afe]]
    });
  };

  /**
   * Destroy this view.
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    _this.model.off('change:timeHorizon', _onChange);
    _this = null;
  }, _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = TimeHorizonLineView;
