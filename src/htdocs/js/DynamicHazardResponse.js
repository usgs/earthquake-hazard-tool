'use strict';


var Collection = require('mvc/Collection'),
    HazardCurve = require('HazardCurve'),
    HazardUtil = require('HazardUtil'),
    Model = require('mvc/Model');


var _MIN_VALUE = 1E-14,
    _TYPE = 'DynamicHazardResponse';


var DynamicHazardResponse = function (params) {
  var _this,
      _initialize;


  _this = Model();

  _initialize = function (params) {
    var attributes;

    attributes = {
      'type': _TYPE,
      'xlabel': '',
      'ylabel': '',
      'curves': []
    };

    params = params || [];

    params.forEach(function (response) {
      attributes.xlabel = response.metadata.xlabel;
      attributes.ylabel = response.metadata.ylabel;

      attributes.curves.push(_this.createTotalCurve(response));
    });

    attributes.curves = Collection(attributes.curves);

    _this.set(attributes, {silent: true});
  };

  _this.createComponentCurveCollection = function (response) {
    var curves,
        data,
        metadata;

    curves = [];

    metadata = response.metadata;
    data = response.data;

    data.forEach(function (item) {
      if (item.component.toLowerCase() !== 'total') {
        curves.push(HazardCurve({
          label: item.component,
          imt: metadata.imt.value,
          period: HazardUtil.periodToNumber(metadata.imt.value),
          data: _this.trimSmallValues(metadata.xvalues, item.yvalues)
        }));
      }
    });

    return Collection(curves);
  };

  _this.createTotalCurve = function (response) {
    var metadata,
        item;

    metadata = response.metadata;

    // Find the y-values for the total curve
    response.data.some(function (curve) {
      if (curve.component.toLowerCase() === 'total') {
        item = curve;
        return true;
      }
    });

    return HazardCurve({
      label: metadata.imt.display,
      imt: metadata.imt.value,
      period: HazardUtil.periodToNumber(metadata.imt.value),
      data: _this.trimSmallValues(metadata.xvalues, item.yvalues),
      components: _this.createComponentCurveCollection(response)
    });
  };

  _this.trimSmallValues = function (xvals, yvals) {
    var index;

    yvals.some(function (val, idx) {
      index = idx;
      return val <= _MIN_VALUE;
    });

    return HazardUtil.coallesce(xvals.slice(0, index), yvals.slice(0, index));
  };


  _initialize(params);
  params = null;
  return _this;
};


DynamicHazardResponse.TYPE = _TYPE;
DynamicHazardResponse.MIN_VALUE = _MIN_VALUE;


module.exports = DynamicHazardResponse;
