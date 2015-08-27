'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util'),

    HazardUtil = require('HazardUtil');

var CURVE_ID = 0;

var HazardCurve = function (params) {
  var _this,
      _initialize,

      _hazardUtil;

  _this = Model(Util.extend({
    id: 'curve-' + CURVE_ID++,
    imt: null,
    label: 'Hazard Curve',
    period: null,
    data: []
  }, params));

  _initialize = function () {
    _hazardUtil = HazardUtil;
  };

  /**
   * Gets X value with a given Y value by interpolating the bounds
   *
   * @param variable {int}
   *
   * This method is a little confusing. Once the X and Y values of the bounds
   * are found the X and Y values are switched. This solves for x in the
   * interpolate so x0's value is switched with
   * y0's value, etc.
   */
  _this.getX = function (y) {
    var data,
        i,
        left,
        point,
        pointX,
        pointY,
        right,
        x0,
        x1,
        y0,
        y1;

    data = _this.get('data');
    left = null;
    right = null;

    for (i = 0; i < data.length; i++) {
      point = data[i];
      pointX = point[0];
      pointY = point[1];

      if (y === pointY) {
        return pointX;
      } else {
        if (y > pointY) {
          if (left === null || pointY > left[1]) {
            left = point;
          }
        }
        if (y < pointY) {
          if (right === null || pointY < right[1]) {
            right = point;
          }
        }
      }
    }

    if (left === null || right === null) {
      return null;
    }

    x0 = left[0];
    y0 = left[1];
    x1 = right[0];
    y1 = right[1];

    return _hazardUtil.interpolateLogLog(y0, x0, y1, x1, y);
  };

  /**
   * Gets Y value with a given X value by interpolating the bounds
   *
   * @param variable {int}
   */
  _this.getY = function (x) {
    var data,
        i,
        left,
        point,
        pointX,
        pointY,
        right,
        x0,
        x1,
        y0,
        y1;

    data = _this.get('data');
    left = null;
    right = null;

    for (i = 0; i < data.length; i++) {
      point = data[i];
      pointX = point[0];
      pointY = point[1];

      if (x === pointX) {
        return pointY;
      } else {
        if (x > pointX) {
          if (left === null || pointX > left[0]) {
            left = point;
          }
        }
        if (x < pointX) {
          if (right === null || pointX < right[0]) {
            right = point;
          }
        }
      }
    }

    x0 = left[0];
    y0 = left[1];
    x1 = right[0];
    y1 = right[1];

    return _hazardUtil.interpolateLogLog(x0, y0, x1, y1, x);
  };

  _initialize();
  params = null;
  return _this;
};

module.exports = HazardCurve;
