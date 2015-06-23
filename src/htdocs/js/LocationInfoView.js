'use strict';

var SelectedCollectionView = require('mvc/SelectedCollectionView');

var LocationInfoView = function (params) {
  var _this,
      _initialize,

      locationInfo,
      noLocationInfo;

  _this = SelectedCollectionView(params);

  _initialize = function () {

    _this.el.innerHTML = '<div class="locationInfo"></div>' +
        '<div class="noLocationInfo"></div>';

    locationInfo = _this.el.querySelector('.locationInfo').innerHTML;
    noLocationInfo = _this.el.querySelector('.noLocationInfo').innerHTML;

    _this.render();
  };

  _this.render = function () {
    var latitude,
        longitude;

    latitude = _this.model.get('latitude');
    longitude = _this.model.get('longitude');

    if (_this.model) {
      if (latitude !== null && longitude !== null) {
        locationInfo = '<ul class="no-style">' +
            '<li>Latitude: '+ latitude +'</li>' +
            '<li>Longitude: '+ longitude +'</li>' +
            '</ul>';
      } else {
        noLocationInfo = '<p>Use the map to select a location.</p>';
      }
    } else {
       locationInfo = '';
       noLocationInfo = '';
    }
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = LocationInfoView;