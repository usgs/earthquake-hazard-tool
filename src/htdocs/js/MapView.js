'use strict';

var Layers = require('map/Layers'),
    LayerControl = require('map/LayerControl'),

    L = require('leaflet'),

    LocationControl = require('locationview/LocationControl'),

    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');

require('map/MousePosition');
require('map/Fullscreen');


var MapView = function (options) {
  var _this,
      _initialize,

      // variables
      _locationControl,
      _map,

      // methods
      _onLocationChange;

  _this = SelectedCollectionView(options);

  _initialize = function () {
    var el;

    el = _this.el.appendChild(document.createElement('div'));
    el.classList.add('map-view');

    _map = L.map(el, {
      scrollWheelZoom: false,
      zoomAnimation: true,
      attributionControl: false // This is added later, but order matters
    });

    // Add layers/control to the map
    _map.addControl(new LayerControl(Layers));

    // Add Map Controls
    if (!Util.isMobile()) {
      _map.addControl(L.control.fullscreen());
      _map.addControl(L.control.scale({position: 'bottomright'}));
      _map.addControl(L.control.mousePosition());
      _map.addControl(L.control.attribution());
    }

    // Add location control
    _locationControl = new LocationControl({
      el: el,
      includeGeolocationControl: true,
      includeGeocodeControl: true,
      includeCoordinateControl: true,
      includePointControl: true
    });
    _locationControl.on('location', _onLocationChange);
    _map.addControl(_locationControl);

    _map.fitBounds([[24.6, -125.0], [50.0, -65.0]]);

    if (_this.model) {
      var location;

      location = _this.model.get('location');

      if (location) {
        _locationControl.setLocation(location);
      } else {
        _locationControl.enable();
      }
    } else {
      _locationControl.enable();
    }
  };


  _onLocationChange = function (changes) {
    var location;

    if (_this.model) {
      // TODO :: Use model.update once it's implemented
      //_this.model.update({'location': changes.location});

      location = _this.model.get('location');

      if (!location ||
          location.latitude !== changes.location.latitude ||
          location.longitude !== changes.location.longitude) {
        _this.model.set({location: changes.location});
      }
    }
  };

  /**
   * Return the Leaflet map
   */
  _this.getMap = function () {
    return _map;
  };

  _this.destroy = Util.compose(function () {
    _locationControl.off('location', _onLocationChange);
    _map.removeControl(_locationControl);

    // variables
    _locationControl = null;
    _map = null;

    // methods
    _onLocationChange = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    var modelLocation,
        controlLocation;

    if (_this.model) {
      modelLocation = _this.model.get('locatin');
      controlLocation = _locationControl.getLocation();

      if (modelLocation && (
          !controlLocation ||
          modelLocation.latitude !== controlLocation.latitude ||
          modelLocation.longutde !== controlLocation.longtiude)) {
        _locationControl.setLocation(_this.model.get('location'));
      }
    }
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = MapView;
