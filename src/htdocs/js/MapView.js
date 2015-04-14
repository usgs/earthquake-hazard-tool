'use strict';

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
    var layerControl,
        terrainLayer,
        grayscaleLayer,
        streetLayer,
        satelliteLayer;

    _this.el.className = 'map-view';
    _this.el.setAttribute('style', 'height:100%;');

    _map = L.map(_this.el, {
      center: [0.0, 0.0],
      zoom: 2,
      zoomAnimation: true
    });

    // Add layer control
    layerControl = L.control.layers();

    // Terrain layer
    terrainLayer = L.tileLayer(
        'http://{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}.jpg',
        {'subdomains': ['server', 'services']});
    layerControl.addBaseLayer(terrainLayer, 'Terrain');

    // Grayscale layer
    grayscaleLayer = L.tileLayer(
        'http://{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.jpg',
        {'subdomains': ['server', 'services']});
    layerControl.addBaseLayer(grayscaleLayer, 'Grayscale');

    // Street Layer
    streetLayer = L.tileLayer(
        'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
        {'subdomains': '1234'});
    layerControl.addBaseLayer(streetLayer, 'Street');

    //Satellite Layer
    satelliteLayer = L.tileLayer(
        'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg',
        {'subdomains': '1234'});
    layerControl.addBaseLayer(satelliteLayer, 'Satellite');

    // Add to the map
    _map.addControl(layerControl);
    _map.addLayer(terrainLayer);

    // Add Map Controls
    if (!Util.isMobile()) {
      _map.addControl(L.control.mousePosition());
      _map.addControl(L.control.scale({'position':'bottomleft'}));
    }

    // disable mouse wheel zoom
    _map.scrollWheelZoom.disable();
  };

  /**
   * Called when tab is selected.
   */
  _this.onSelect = function () {
    _map.invalidateSize();
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