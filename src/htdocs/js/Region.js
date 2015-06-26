'use strict';

var Util = require('util/Util'),
    Meta = require('Meta');


var Region = function (options) {
  var _this;

  _this = Meta(Util.extend({
    minlatitude: null,
    maxlatitude: null,
    minlongitude: null,
    maxlongitude: null,
    gridspacing: null
  }, options));


  _this.contains = function (location) {
    var latitude,
        longitude,
        minlatitude,
        minlongitude,
        maxlatitude,
        maxlongitude;

    latitude = location.latitude;
    longitude = location.longitude;

    minlatitude = _this.get('minlatitude');
    minlongitude = _this.get('minlongitude');
    maxlatitude = _this.get('maxlatitude');
    maxlongitude = _this.get('maxlongitude');

    return (latitude >= minlatitude && latitude <= maxlatitude &&
        longitude >= minlongitude && longitude <= maxlongitude);
  };


  options = null;
  return _this;
};

module.exports = Region;
