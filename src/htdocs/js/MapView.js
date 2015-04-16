'use strict';

var Layers = require('map/Layers'),
    LayerControl = require('map/LayerControl');

require('map/MousePosition');

var L = require('leaflet'),
    Util = require('util/Util'),
    View = require('mvc/View');

var MapView = function (options) {
  var _this,
      _initialize,

      // variables
      _map;

  _this = View(options);

  _initialize = function () {
    _this.el.className = 'map-view';
    _this.el.setAttribute('style', 'height:100%;');

    _map = L.map(_this.el, {
      scrollWheelZoom: false,
      zoomAnimation: true
    });

    // Add layers/control to the map
    _map.addControl(new LayerControl(Layers));

    // Add Map Controls
    if (!Util.isMobile()) {
      _map.addControl(L.control.mousePosition());
      _map.addControl(L.control.scale({'position':'bottomleft'}));
    }

    _map.fitBounds([[24.6, -125.0], [50.0, -65.0]]);
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
      // variables
      _map = null;
  }, _this.destroy);

  _initialize(options);
  options = null;
  return _this;
};

module.exports = MapView;
