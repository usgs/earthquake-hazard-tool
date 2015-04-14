'use strict';


var HazardUtil = {};


var _coallesce,
    _interpolate,
    _interpolateCurve;


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


module.exports = HazardUtil;
