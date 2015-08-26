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
    _this.el.classList.add('alert');
    _this.el.classList.add('info');
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
    var location;

    if (_this.model) {
      location = _this.model.get('location');

      if (location) {
        _this.el.classList.remove('info');
        _this.el.classList.add('success');

        if (location.place) {
          _locationInfo.innerHTML = '<strong>' + location.place + '</strong>' +
            '<small>' +
              Formatter.latitude(location.latitude) + ', ' +
              Formatter.longitude(location.longitude) +
            '</small>';
        } else {
          _locationInfo.innerHTML = Formatter.latitude(location.latitude) +
              ', ' + Formatter.longitude(location.longitude);
        }
        _noLocationInfo.innerHTML = '';
      } else {
        _locationInfo.innerHTML = '';
        _noLocationInfo.innerHTML = 'Use the map to select a location.';
      }
    } else {
       _locationInfo.innerHTML = '';
       _noLocationInfo.innerHTML = '';
    }
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = LocationInfoView;
