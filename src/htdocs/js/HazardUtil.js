'use strict';


var HazardUtil = {};


var _coallesce,
    _interpolate,
    _interpolateCurve,
    _interpolateLogLog;


_coallesce = function (xvals, yvals) {
  var i,
      len,
      x,
      xy,
      y;

  xy = [];
  len = Math.min(xvals.length, yvals.length);

  for (i = 0; i < len; i++) {
    x = xvals[i];
    y = yvals[i];

    if (!x || !y) {
      continue;
    }

    xy.push([x, y]);
  }

  return xy;
};

/**
 * Logs x and y values.
 * Interpolates the logged values.
 * Return exponential of interpolated values.
 *
 * @params variables {int, int, int, int, int}
 */

_interpolateLogLog = function (x0, y0, x1, y1, x) {
  if (x0 === 0 || y0 === 0 || x1 === 0 || y1 === 0 || x === 0) {
    throw new Error('Can not get the log of 0');
  } else {
    x0 = Math.log(x0);
    y0 = Math.log(y0);
    x1 = Math.log(x1);
    y1 = Math.log(y1);
    x = Math.log(x);

    return Math.exp(_interpolate(x0, y0, x1, y1, x));
  }
};

_interpolate = function (x0, y0, x1, y1, x) {
  return y0 + ((x - x0) * ((y1 - y0) / (x1 - x0)));
};

_interpolateCurve = function (x0, y0, x1, y1, x) {
  var i,
      len,
      y;

  y = [];
  len = Math.min(y0.length, y1.length);

  for (i = 0; i < len; i++) {
    y.push(_interpolate(x0, y0[i], x1, y1[i], x));
  }

  return y;
};


// Expose the API
HazardUtil.coallesce = _coallesce;
HazardUtil.interpolate = _interpolate;
HazardUtil.interpolateCurve = _interpolateCurve;
HazardUtil.interpolateLogLog = _interpolateLogLog;


module.exports = HazardUtil;
