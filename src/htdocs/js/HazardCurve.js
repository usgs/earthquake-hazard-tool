'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util'),

    hazardUtil = require('HazardUtil');

var CURVE_ID = 0;

var HazardCurve = function (params) {
  var _this,
      _initialize,

      _hazardUtil;

  _this = Model(Util.extend({
    id: 'curve-' + CURVE_ID++,
    label: 'Hazard Curve',
    data: []
  }, params));

  _initialize = function () {
    _hazardUtil = hazardUtil();
  };

  _this.getX = function (y) {
    var data;

    data = _this.get('data');

    return _this.getBounds(data, y, 0);
  };

  _this.getY = function (x) {
    var data;

    data = _this.get('data');

    return _this.getBounds(data, x, 1);
  };

  _this.getBounds = function (data, target, index) {
    var lower,
        upper,
        x,
        x0,
        x1,
        y0,
        y1;

    lower = data[0];
    upper = data[data.length - 1];

    data.forEach(function (item) {
      if (item[index] < target && (item[index] > lower[index])) {
        lower = item;
      }
      if (item[index] > target && (item[index] < upper[index])) {
        upper = item;
      }
    });

    x0 = lower[0][0];
    y0 = lower[0][1];
    x1 = upper[0][0];
    y1 = upper[0][1];
    x  = target;

    if (index === 0) {
      x0 = y0;
      y0 = x0;
      x1 = y1;
      y1 = x1;
    }

    return _hazardUtil.interpolate(x0, y0, x1, y1, x);
  };

  _initialize();
  params = null;
  return _this;
};

module.exports = HazardCurve;
