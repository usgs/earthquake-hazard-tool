'use strict';

var L = require('leaflet'),
    Util = require('mvc/Util'),
    View = require('mvc/View'),
    MousePosition = require('map/MousePosition');

var MapView = function (options) {
  var _this,
      _initialize,

      // variables
      _el,
      _map,
      _mapEl,

      // methods
      _onDeselect,
      _onSelect;

  _this = View(options);

  _initialize = function () {
    var layerControl,
        terrainLayer,
        grayscaleLayer,
        streetLayer,
        satelliteLayer;

    _mapEl = document.createElement('div');
    _mapEl.className = 'map-wrapper';

    _el = _this.el;
    _el.appendChild(_mapEl);

    _map = new L.Map(_mapEl, {
      center: [0.0, 0.0],
      zoom: 2,
      zoomAnimation: true,
      attributionControl: false
    });

    // Add layer control
    layerControl = new L.Control.Layers();

    // Terrain layer
    terrainLayer = new L.TileLayer(
        'http://{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}.jpg',
        {'subdomains': ['server', 'services']});
    layerControl.addBaseLayer(terrainLayer, 'Terrain');

    // Grayscale layer
    grayscaleLayer = new L.TileLayer(
        'http://{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.jpg',
        {'subdomains': ['server', 'services']});
    layerControl.addBaseLayer(grayscaleLayer, 'Grayscale');

    // Street Layer
    streetLayer = new L.TileLayer(
        'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
        {'subdomains': '1234'});
    layerControl.addBaseLayer(streetLayer, 'Street');

    //Satellite Layer
    satelliteLayer = new L.TileLayer(
        'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg',
        {'subdomains': '1234'});
    layerControl.addBaseLayer(satelliteLayer, 'Satellite');

    // Add to the map
    _map.addControl(layerControl);
    _map.addLayer(terrainLayer);

    // Add Map Controls
    if (!Util.isMobile()) {
      _map.addControl(new MousePosition());
      _map.addControl(new L.Control.Scale({'position':'bottomleft'}));
    }

    options = null;
  };

  /**
   * Called when tab is selected.
   */
  _onSelect = function () {
    console.log('triggered _onSelect');
  };

  /**
   * Called when tab is deselected.
   */
  _onDeselect = function () {
    console.log('triggered _onDeselect');
  };

  _this.destroy = function () {
      // variables
      _el = null;
      _map = null;
      _mapEl = null;

      // methods
      _onDeselect = null;
      _onSelect = null;
  };

  _initialize();
  return _this;
};

module.exports = MapView;