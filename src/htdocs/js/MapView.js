/* global L */
'use strict';

var FullscreenControl = require('leaflet/control/Fullscreen'),
    Layers = require('map/Layers'),
    LayerControl = require('map/LayerControl'),
    MousePosition = require('leaflet/control/MousePosition'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');


var MapView = function (options) {
  var _this,
      _initialize;


  _this = SelectedCollectionView(options);

  _initialize = function (options) {
    var el,
        map;

    _this.dependencyFactory = options.dependencyFactory;
    _this.editions = options.editions;

    el = _this.el.appendChild(document.createElement('div'));
    el.classList.add('map-view');

    _this.map = map = L.map(el, {
      scrollWheelZoom: false,
      zoomAnimation: false,
      attributionControl: false // This is added later, but order matters
    });

    // Add layers/control to the map
    map.addControl(new LayerControl(Util.extend(Layers, {
      collection: _this.collection,
      dependencyFactory: _this.dependencyFactory,
      editions: _this.editions
    })));

    // Add Map Controls
    if (!Util.isMobile()) {
      map.addControl(new FullscreenControl());
      map.addControl(L.control.scale());
      map.addControl(new MousePosition());
      map.addControl(L.control.attribution());
    }

    map.fitBounds([[24.6, -125.0], [50.0, -65.0]]);
  };


  _this.destroy = Util.compose(function () {
    if (!_this) {
      return;
    }

    // destroy leaflet map
    _this.map.remove();

    _initialize = null;
    _this = null;
  }, _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MapView;
