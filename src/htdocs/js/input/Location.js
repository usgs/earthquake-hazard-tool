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
      _initialize,

      _errorMessage,
      _inputLatitude,
      _inputLongitude,
      _latitude,
      _locationView,
      _longitude,
      _usemap,

      _createViewSkeleton,
      _onInputChange,
      _onLocation,
      _onUseMapClick;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function (/*params*/) {
    _createViewSkeleton();

    _latitude = _this.el.querySelector('#input-latitude');
    _longitude = _this.el.querySelector('#input-longitude');
    _usemap = _this.el.querySelector('#input-usemap');

    _locationView = LocationView({
      callback: _onLocation
    });

    _latitude.addEventListener('change', _onInputChange, _this);
    _longitude.addEventListener('change', _onInputChange, _this);
    _usemap.addEventListener('click', _onUseMapClick, _this);
    _this.model.on('change:error', _this.checkError);
    _this.model.on('change:edition', _this.checkError);

    // Render initially to reflect model state
    _this.render();
  };


  _createViewSkeleton = function () {
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

    _errorMessage = _this.el.querySelector('#input-error-message');
    _inputLatitude = _this.el.querySelector('#input-latitude');
    _inputLongitude = _this.el.querySelector('#input-longitude');
  };

  _onInputChange = function () {
    var confidence,
        latitudeVal,
        location,
        longitudeVal;

    try {
      latitudeVal = parseFloat(_latitude.value);
    } catch (e) {
      // Ignore, validator will deal with this later...
    }

    try {
      longitudeVal = parseFloat(_longitude.value);
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
  _onLocation = function (location) {
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
  _onUseMapClick = function (evt) {
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

    _locationView.show(options);
    return evt.preventDefault();
  };


  _this.addErrorMessage = function () {
    var inputError,
        message;

    inputError = _this.model.get('error');
    message = inputError.location;

    _errorMessage.innerHTML = message;
    _inputLatitude.parentElement.classList.add('usa-input-error-label');
    _inputLongitude.parentElement.classList.add('usa-input-error-label');
    _errorMessage.parentElement.classList.add('usa-input-error');
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

  _this.destroy = Util.compose(function () {
    if (_this ===  null) {
      return; // already destroyed
    }

    if (_latitude) {
      _latitude.removeEventListener('change', _onInputChange, _this);
    }

    if(_longitude) {
      _longitude.removeEventListener('change', _onInputChange, _this);
    }

    if(_usemap) {
      _usemap.removeEventListener('click', _onUseMapClick, _this);
    }

    _this.model.off('change:error', _this.checkError);
    _this.model.off('change:edition', _this.checkError);

    _errorMessage = null;
    _inputLatitude = null;
    _inputLongitude = null;
    _latitude = null;
    _locationView = null;
    _longitude = null;
    _usemap = null;

    _createViewSkeleton = null;
    _onInputChange = null;
    _onLocation = null;
    _onUseMapClick = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.removeErrorMessage = function () {
    _errorMessage.innerHTML = '';
    _inputLatitude.parentElement.classList.remove('usa-input-error-label');
    _inputLongitude.parentElement.classList.remove('usa-input-error-label');
    _errorMessage.parentElement.classList.remove('usa-input-error');
  };

  _this.render = function () {
    var location;

    location = _this.model.get('location');

    if (location) {
      _latitude.value = location.latitude;
      _longitude.value = location.longitude;
    }
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = Location;
