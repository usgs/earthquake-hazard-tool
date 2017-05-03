'use strict';


var ConfidenceCalculator = require('locationview/ConfidenceCalculator'),
    CoordinateControl = require('locationview/CoordinateControl'),
    LocationView = require('locationview/LocationView'),

    View = require('mvc/View'),

    Util = require('util/Util');


var _DEFAULTS = {

};


var Location = function (params) {
  var _this,
      _initialize;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function (/*params*/) {
    _this.createViewSkeleton();

    _this.latitude = _this.el.querySelector('#input-latitude');
    _this.longitude = _this.el.querySelector('#input-longitude');
    _this.usemap = _this.el.querySelector('#input-usemap');

    _this.locationView = LocationView({
      callback: _this.onLocation
    });

    _this.latitude.addEventListener('change', _this.onInputChange);
    _this.longitude.addEventListener('change', _this.onInputChange);
    _this.usemap.addEventListener('click', _this.onUseMapClick);
    _this.model.on('change:error', 'checkError', _this);
    _this.model.on('change:edition', 'checkError', _this);

    // Render initially to reflect model state
    _this.render();
  };

  _this.addErrorMessage = function () {
    var inputError,
        message;

    inputError = _this.model.get('error');
    message = inputError.location;

    _this.errorMessage.innerHTML = message;
    _this.inputLatitude.parentElement.classList.add('usa-input-error-label');
    _this.inputLongitude.parentElement.classList.add('usa-input-error-label');
    _this.errorMessage.parentElement.classList.add('usa-input-error');
  };

  _this.checkError = function () {
    var errorCheck;

    errorCheck = _this.model.get('error');

    if (errorCheck === null) {
      _this.removeErrorMessage();
    } else {
      _this.addErrorMessage();
    }
  };

  _this.createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<label for="input-latitude">',
        'Latitude',
        '<small class="input-help">Decimal degrees</small>',
        '<input type="text" id="input-latitude"/>',
      '</label>',
      '<label for="input-longitude">',
        'Longitude',
        '<small class="input-help">',
          'Decimal degrees, negative values for western longitudes',
        '</small>',
        '<input type="text" id="input-longitude"/>',
      '</label>',
      '<span class="usa-input-error-message" id="input-error-message"',
          'role="alert"></span>',
      '<button id="input-usemap">',
        'Choose location using a map',
      '</button>'
    ].join('');

    _this.errorMessage = _this.el.querySelector('#input-error-message');
    _this.inputLatitude = _this.el.querySelector('#input-latitude');
    _this.inputLongitude = _this.el.querySelector('#input-longitude');
  };

  _this.destroy = Util.compose(function () {
    if (_this ===  null) {
      return; // already destroyed
    }

    if (_this.latitude) {
      _this.latitude.removeEventListener('change', _this.onInputChange);
    }

    if(_this.longitude) {
      _this.longitude.removeEventListener('change', _this.onInputChange);
    }

    if(_this.usemap) {
      _this.usemap.removeEventListener('click', _this.onUseMapClick);
    }

    _this.model.off('change:error', 'checkError', _this);
    _this.model.off('change:edition', 'checkError', _this);

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.onInputChange = function () {
    var confidence,
        latitudeVal,
        location,
        longitudeVal;

    try {
      latitudeVal = parseFloat(_this.latitude.value);
    } catch (e) {
      // Ignore, validator will deal with this later...
    }

    try {
      longitudeVal = parseFloat(_this.longitude.value);
    } catch (e) {
      // Ignore, validator will deal with this later...
    }

    if (isNaN(latitudeVal) && isNaN(longitudeVal)) {
      // Both are NaN, update model
      _this.model.set({
        location: null
      });
    } else if (!(isNaN(latitudeVal) || isNaN(longitudeVal))) {
      // Neither is NaN, update model
      confidence = ConfidenceCalculator.computeFromCoordinates(
          latitudeVal, longitudeVal);

      location = {
        place: '',
        latitude: latitudeVal,
        longitude: longitudeVal,
        method: CoordinateControl.METHOD,
        confidence: confidence
      };

      _this.model.set({
        location: location
      });
    }
  };

  /**
   * Callback when a user has interacted with the location view and selected
   * a location. This method sets the value on the model which in-turn will
   * trigger a render.
   *
   */
  _this.onLocation = function (location) {
    // Round to only 3 decimals for locations not directly typed
    if (location.method !== CoordinateControl.METHOD) {
      location.latitude = Math.round(location.latitude * 1000) / 1000;
      location.longitude = Math.round(location.longitude * 1000) / 1000;
      // We don't want the 3 decimal rounding to somehow _increase_ precision
      // in terms of the confidence placed on the location
      location.confidence = Math.min(location.confidence,
          ConfidenceCalculator.computeFromCoordinates(
              location.latitude.toFixed(3), location.longitude.toFixed(3)));
    }

    _this.model.set({
      location: location
    });
  };

  /**
   * Event handler when the _useMap button is clicked. Shows the location
   * view in a modal dialog.
   *
   */
  _this.onUseMapClick = function (evt) {
    var currentLocation,
        options;

    currentLocation = _this.model.get('location');

    if (currentLocation) {
      options = {
        location: currentLocation
      };
    } else {
      options = {
        extent: [
          [24.6, -125.0],
          [50.0, -65.0]
        ]
      };
    }

    _this.locationView.show(options);
    return evt.preventDefault();
  };

  _this.removeErrorMessage = function () {
    _this.errorMessage.innerHTML = '';
    _this.inputLatitude.parentElement.classList.remove('usa-input-error-label');
    _this.inputLongitude.parentElement.classList.remove('usa-input-error-label');
    _this.errorMessage.parentElement.classList.remove('usa-input-error');
  };

  _this.render = function () {
    var location;

    location = _this.model.get('location');

    if (location) {
      _this.latitude.value = location.latitude;
      _this.longitude.value = location.longitude;
    }
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = Location;
