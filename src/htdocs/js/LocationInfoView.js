'use strict';

var Formatter = require('util/Formatter'),
    SelectedCollectionView = require('mvc/SelectedCollectionView');

var LocationInfoView = function (params) {
  var _this,
      _initialize,

      _formatter,
      _locationInfo,
      _noLocationInfo;

  _this = SelectedCollectionView(params);
  _formatter = Formatter();

  _initialize = function () {

    _this.el.innerHTML = '<div class="locationInfo"></div>' +
        '<div class="noLocationInfo"></div>';

    _locationInfo = _this.el.querySelector('.locationInfo').innerHTML;
    _noLocationInfo = _this.el.querySelector('.noLocationInfo').innerHTML;

    _this.render();
  };

  _this.render = function () {
    var lat,
        lng;

    lat = Formatter.latitude(_this.model.get('latitude'));
    lng = Formatter.longitude(_this.model.get('longitude'));

    if (_this.model) {
      if (lat !== null && lng !== null) {
        _locationInfo = '<ul class="no-style">' +
            '<li>Latitude: '+ lat +'</li>' +
            '<li>Longitude: '+ lng +'</li>' +
            '</ul>';
      } else {
        _noLocationInfo = '<p>Use the map to select a location.</p>';
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