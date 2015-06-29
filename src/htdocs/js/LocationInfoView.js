'use strict';

var Formatter = require('./util/Formatter'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');

var LocationInfoView = function (params) {
  var _this,
      _initialize,

      _locationInfo,
      _noLocationInfo;

  _this = SelectedCollectionView(params);

  _initialize = function () {
    _this.el.innerHTML = '<div class="locationInfo"></div>' +
        '<div class="noLocationInfo"></div>';

    _locationInfo = _this.el.querySelector('.locationInfo');
    _noLocationInfo = _this.el.querySelector('.noLocationInfo');

    _this.render();
  };

  _this.destroy = Util.compose(function () {
    _locationInfo = null;
    _noLocationInfo = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);

  _this.render = function () {
    var lat,
        lng;

    if (_this.model) {
      lat = _this.model.get('latitude');
      lng = _this.model.get('longitude');

      if (lat !== null && lng !== null) {
        _locationInfo.innerHTML = '<ul class="no-style">' +
            '<li>Latitude: '+ Formatter.latitude(lat) + '</li>' +
            '<li>Longitude: '+ Formatter.longitude(lng) + '</li>' +
            '</ul>';
      } else {
        _noLocationInfo.innerHTML = '<p>Use the map to select a location.</p>';
      }
    } else {
       _locationInfo = '';
       _noLocationInfo = '';
    }
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = LocationInfoView;
