'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');


var HazardCurve = function (options) {
  var _this;

  /**
   * xvals: [Array<Number>]
   * yvals: [Array<Object>]
   *  - This is an array of sub-objects because there may be multiple sets
   *    of Y-Values for each set of X-Values. This is due to geographic
   *    interpolation required for static data mining.
   *  - Each object in the array of Y-Values will have the following keys:
   *    - Latitude (latitude) [Number]
   *    - Longitude (longitude) [Number]
   *    - Title (title) [String]
   *    - Y-Values (yvals)  [Array<Number>]
   */
  _this = Model(Util.extend({
    site: null,
    xlabel: null,
    ylabel: null,
    xvals: null,
    yvals: null
  }, options));

  options = null;
  return _this;
};

module.exports = HazardCurve;
