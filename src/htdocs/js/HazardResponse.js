'use strict';

var HazardCurve = require('HazardCurve'),
    HazardUtil = require('HazardUtil'),

    Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    Util = require('util/Util');


var HazardResponse = function (params) {
  var _this,
      _initialize,

      _createCurve,
      _spatiallyInterpolate;


  _this = Model();

  _initialize = function (params) {
    var attributes;

    attributes = {
      'xlabel': '',
      'ylabel': '',
      'curves': []
    };

    params = params || [];

    params.map(function (response) {
      attributes.xlabel = response.metadata.xlabel;
      attributes.ylabel = response.metadata.ylabel;

      attributes.curves.push(_createCurve(response));
    });

    attributes.curves = Collection(attributes.curves);


    _this.set(attributes);
  };


  _createCurve = function (response) {
    var data,
        metadata,
        yvals;

    data = response.data;
    metadata = response.metadata;

    yvals = _spatiallyInterpolate(metadata.latitude, metadata.longitude, data);

    return HazardCurve({
      label: metadata.imt.display,
      data: HazardUtil.coallesce(metadata.xvals, yvals)
    });
  };

  _spatiallyInterpolate = function (latitude, longitude, data) {
    var bottom,
        numYVals,
        result,
        top,
        y0,
        y1,
        y2,
        y3;

    result = [];
    numYVals = data.length;

    if (numYVals === 1) {
      result = data[0].yvals;
    } else if (numYVals === 2) {
      y0 = data[0];
      y1 = data[1];

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
      y0 = data[0];
      y1 = data[1];
      y2 = data[2];
      y3 = data[3];

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


  _this.destroy = Util.compose(_this.destroy, function () {
    _createCurve = null;
    _spatiallyInterpolate = null;

    _initialize = null;
    _this = null;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = HazardResponse;
