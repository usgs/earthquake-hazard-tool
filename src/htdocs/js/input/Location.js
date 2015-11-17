'use strict';

var LocationView = require('locationview/LocationView'),

    View = require('mvc/View'),

    Util = require('util/Util');


var _DEFAULTS = {

};


var Location = function (params) {
  var _this,
      _initialize,

      _latitude,
      _locationView,
      _longitude,
      _usemap,

      _createViewSkeleton,
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

    _usemap.addEventListener('click', _onUseMapClick, _this);
  };


  _createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<label for="input-latitude">',
        'Latitude',
        '<small class="help">Decimal degrees</small>',
        '<input type="text" id="input-latitude"/>',
      '</label>',
      '<label for="input-longitude">',
        'Longitude',
        '<small class="help">',
          'Decimal degrees. Use negative values for western longitudes.',
        '</small>',
        '<input type="text" id="input-longitude"/>',
      '</label>',
      '<a href="javascript:void(null);" id="input-usemap">',
        'Choose location using a map',
      '</a>'
    ].join('');
  };

  /**
   * Callback when a user has interacted with the location view and selected
   * a location. This method sets the value on the model which in-turn will
   * trigger a render.
   *
   */
  _onLocation = function (location) {
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
    _locationView.show();
    return evt.preventDefault();
  };


  _this.destroy = Util.compose(function () {

  }, _this.destroy);

  _this.render = function () {
    var location;

    location = _this.model.get('location');

    _latitude.value = location.latitude;
    _longitude.value = location.longitude;
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = Location;
