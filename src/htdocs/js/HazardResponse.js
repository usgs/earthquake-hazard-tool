'use strict';

var HazardCurve = require('HazardCurve'),
    HazardUtil = require('HazardUtil'),

    Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    Util = require('util/Util');


var HazardResponse = function (params) {
  var _this,
      _initialize,

      _spatiallyInterpolate;


  _this = Model();

  _initialize = function (params) {
    var data,
        metadata;

    params = params || {};
    data = params.data || [];
    metadata = params.metadata || {};

    _this.set({
      xlabel: metadata.xlabel,
      ylabel: metadata.ylabel,

      curves: _this.createCurveCollection(params)
    });
  };


  _spatiallyInterpolate = function (latitude, longitude, yvals) {
    var bottom,
        numYVals,
        result,
        top,
        y0,
        y1,
        y2,
        y3;

    result = [];
    numYVals = yvals.length;

    if (numYVals === 1) {
      result = yvals[0].yvals;
    } else if (numYVals === 2) {
      y0 = yvals[0];
      y1 = yvals[1];

      if (y0.latitude === y1.latitude) {
        // Latitudes match, interpolate with respect to longitude
        result = HazardUtil.interpolateCurve(y0.longitude, y0.yvals,
            y1.longitude, y1.yvals, longitude);
      } else if (y0.longitude === y1.longitude) {
        // Latitudes match, interpolate with respect to latitude
        result = HazardUtil.interpolateCurve(y0.latitude, y0.yvals,
            y1.latitude, y1.yvals, latitude);
      }
    } else if (numYVals === 4) {
      y0 = yvals[0];
      y1 = yvals[1];
      y2 = yvals[2];
      y3 = yvals[3];

      // Interpolate top (first) two points with respect to longitude
      top = HazardUtil.interpolateCurve(y0.longitude, y0.yvals,
          y1.longitude, y1.yvals, longitude);

      // Interpolate bottom (second) two points with respect to longitude
      bottom = HazardUtil.interpolateCurve(y2.longitude, y2.yvals,
          y3.longitude, y3.yvals, longitude);

      // Interpolate top/bottom (interpolated) results with respect to latitude
      result = HazardUtil.interpolateCurve(y0.latitude, top,
          y2.latitude, bottom, latitude);
    }

    return result;
  };


  /**
   * @param rawData {Object}
   *      An object containing data necessary to construct a collection of
   *      curves.
   *
   * @return Collection<HazardCurve>
   *      A collection of hazard curve for this response.
   */
  _this.createCurveCollection = function (rawData) {
    var data,
        metadata,
        yvals;

    data = rawData.data || [];
    metadata = rawData.metadata || {};

    yvals = _spatiallyInterpolate(metadata.latitude,
        metadata.longitude, data);

    return Collection([
      HazardCurve({
        label: 'Mean Hazard Curve',
        data: HazardUtil.coallesce(metadata.xvals, yvals)
      })
    ]);
  };

  _this.destroy = Util.compose(_this.destroy, function () {
    _spatiallyInterpolate = null;

    _initialize = null;
    _this = null;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = HazardResponse;
