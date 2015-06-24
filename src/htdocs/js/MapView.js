'use strict';

var Layers = require('map/Layers'),
    LayerControl = require('map/LayerControl'),

    L = require('leaflet'),

    LocationControl = require('locationview/LocationControl'),

    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');

require('map/MousePosition');


var MapView = function (options) {
  var _this,
      _initialize,

      // variables
      _locationControl,
      _map;

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

  /**
   * Called when tab is selected.
   */
  _this.onSelect = function () {
    _map.invalidateSize();

    if (!_map.getZoom()) {
      _map.fitBounds([[24.6, -125.0], [50.0, -65.0]]);
    }
  };

  /**
   * Called when tab is deselected.
   */
  _this.onDeselect = function () {};

  /**
   * Return the Leaflet map
   */
  _this.getMap = function () {
    return _map;
  };

  _this.destroy = Util.compose(function () {
      _map.removeControl(_locationControl);

      // variables
      _locationControl = null;
      _map = null;

      _initialize = null;
      _this = null;
  }, _this.destroy);

  _initialize(options);
  options = null;
  return _this;
};

module.exports = MapView;
