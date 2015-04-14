'use strict';

var HazardCurve = require('HazardCurve'),
    Meta = require('Meta'),
    Region = require('Region'),

    Collection = require('mvc/Collection'),
    Model = require('mvc/Model');


var HazardResponse = function (params) {
  var _this,
      _initialize,

      _coallesce,
      _createCurveCollection,
      _interpolate;


  _this = Model();

  _initialize = function (params) {
    var data,
        metadata;

    params = params || {};
    data = params.data || [];
    metadata = params.metadata || {};

    _this.set({
      edition: Meta(metadata.edition),
      region: Region(metadata.region),

      longitude: metadata.longitude,
      latitude: metadata.latitude,

      imt: Meta(metadata.imt),
      vs30: Meta(metadata.vs30),

      xlabel: metadata.xlabel,
      ylabel: metadata.ylabel,

      curves: _createCurveCollection(params)
    });
  };

  /**
   * @param xvals {Array}
   *      An array of x-values for a curve.
   * @param yvals {Array}
   *      An array of y-values for a curve.
   *
   * @return {Array}
   *      An array of [x,y] tuples with falsey (zero or undefined)
   *      values removed.
   *
   */
  _coallesce = function (xvals, yvals) {
    var curve,
        i,
        len,
        xval,
        yval;

    curve = [];
    len = Math.min(xvals.length, yvals.length);

    for (i = 0; i < len; i++) {
      xval = xvals[i];
      yval = yvals[i];

      if (!xval || !yval) {
        continue;
      }

      curve.push([xval, yval]);
    }

    return curve;
  };

  /**
   * @param rawData {Object}
   *      An object containing data necessary to construct a collection of
   *      curves.
   *
   * @return Collection<HazardCurve>
   *      A collection of hazard curve for this response.
   */
  _createCurveCollection = function (rawData) {
    var bottomYVals,
        data,
        latitude,
        longitude,
        metadata,
        topYVals,
        xvals,
        yvals;

    data = rawData.data || [];
    metadata = rawData.metadata || {};

    latitude = metadata.latitude;
    longitude = metadata.longitude;
    xvals = metadata.xvals || [];
    yvals = [];

    if (data.length === 1) {
      yvals = data[0].yvals;
    } else if (data.length === 2) {
      if (data[0].latitude === data[1].latitude) {
        // Latitudes match, interpolate with respect to longitude
        yvals = _interpolate(data[0].longitude, data[1].longitude, longitude,
            data[0].yvals, data[1].yvals);
      } else if (data[0].longitude === data[1].longitude) {
        // Longitudes match, interpolate with respect to latitude
        yvals = _interpolate(data[0].latitude, data[1].latitude, latitude,
            data[0].yvals, data[1].yvals);
      }
    } else if (data.length === 4) {
      // Interpolate top-left and top-right
      topYVals = _interpolate(data[0].longitude, data[1].longitude,
          longitude, data[0].yvals, data[1].yvals);

      // Interpolate bottom-left and bottom-right
      bottomYVals = _interpolate(data[0].longitude, data[1].longitude,
          longitude, data[2].yvals, data[3].yvals);

      // Interpolate top and bottom (interpolated values)
      yvals = _interpolate(data[0].latitude, data[2].latitude, latitude,
          topYVals, bottomYVals);
    }

    return Collection([
      HazardCurve({
        label: 'Mean Hazard Curve',
        data: _coallesce(xvals, yvals)
      })
    ]);
  };

  /**
   * @param x0 {Number}
   *      The first x-value to interpolate between.
   * @param x1 {Number}
   *      The second x-value to interpolate between.
   * @param x {Number}
   *      The target x-value for which to compute the interpolated y.
   * @param y0 {Array<Number>}
   *      The first y-value to interpolate between.
   * @param y1 {Array<Number>}
   *      The second y-value to interpolate between.
   *
   * @return {Array<Number>}
   *      An array of y-values for the corresponding to the give x-value.
   */
  _interpolate = function (x0, x1, x, y0, y1) {
    var i,
        len,
        y;

    len = Math.min(y0.length, y1.length);
    y = [];

    for (i = 0; i < len; i++) {
      y.push(y0[i] + ((y1[i] - y0[i]) / (x1 - x0)) * (x - x0));
    }

    return y;
  };




  _initialize(params);
  params = null;
  return _this;
};

module.exports = HazardResponse;
