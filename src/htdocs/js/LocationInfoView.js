'use strict';

var DependencyFactory = require('DependencyFactory'),
    Formatter = require('./util/Formatter'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Events = require('util/Events'),
    Util = require('util/Util');

var LocationInfoView = function (params) {
  var _this,
      _initialize,

      _dependencyFactory,
      _locationInfo,
      _noLocationInfo,

      _validateLocation;

  _this = SelectedCollectionView(params);

  _initialize = function () {
    _dependencyFactory = DependencyFactory.getInstance();

    _this.el.classList.add('alert');
    _this.el.classList.add('info');
    _this.el.innerHTML = '<div class="locationInfo"></div>' +
        '<div class="noLocationInfo"></div>';

    _locationInfo = _this.el.querySelector('.locationInfo');
    _noLocationInfo = _this.el.querySelector('.noLocationInfo');

    Events.on('validate', _validateLocation);

    _this.render();
  };

  _validateLocation = function () {
    var location,
        region,
        errors;

    errors = [];

    if (_this.model) {
      location = _this.model.get('location');

      if (location) {
        region = _dependencyFactory.getRegionByEdition(
          _this.model.get('edition'),location.latitude, location.longitude);

        if (!region) {
          errors.push('This location is not supported by the selected edition.');
        }

      } else {
        errors.push('Location is a required field.');
      }
    }

    if (errors.length === 0) {
      _this.el.className = 'alert success';
      Events.trigger('remove-errors', {
        'input': 'location'
      });
    } else {
      _this.el.className = 'alert error';
      Events.trigger('add-errors', {
        'input': 'location',
        'messages': errors
      });
    }
  };

  _this.destroy = Util.compose(function () {
    _validateLocation = null;
    _dependencyFactory = null;
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

        _validateLocation();

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
