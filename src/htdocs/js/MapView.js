'use strict';

var FullscreenControl = require('leaflet/control/Fullscreen'),
    Layers = require('map/Layers'),
    LayerControl = require('map/LayerControl'),

    L = require('leaflet/Leaflet'),


    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');

require('map/MousePosition');


var MapView = function (options) {
  var _this,
      _initialize,

      // variables
      _editions,
      _dependencyFactory,
      _map;

  _this = SelectedCollectionView(options);

  _initialize = function (options) {
    var el;

    _dependencyFactory = options.dependencyFactory;
    _editions = options.editions;

    el = _this.el.appendChild(document.createElement('div'));
    el.classList.add('map-view');

    _map = L.map(el, {
      scrollWheelZoom: false,
      zoomAnimation: false,
      attributionControl: false // This is added later, but order matters
    });

    // Add layers/control to the map
    _map.addControl(new LayerControl(Util.extend(Layers, {
      collection: _this.collection,
      dependencyFactory: _dependencyFactory,
      editions: _editions
    })));

    // Add Map Controls
    if (!Util.isMobile()) {
      _map.addControl(new FullscreenControl());
      _map.addControl(L.control.scale({position: 'bottomright'}));
      _map.addControl(L.control.mousePosition());
      _map.addControl(L.control.attribution());
    }

    _map.fitBounds([[24.6, -125.0], [50.0, -65.0]]);
  };


  /**
   * Return the Leaflet map
   */
  _this.getMap = function () {
    return _map;
  };

  _this.destroy = Util.compose(function () {

    // variables
    _map = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    var modelLocation;

    if (_this.model) {
      modelLocation = _this.model.get('location');

    } else {

    }
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = MapView;
