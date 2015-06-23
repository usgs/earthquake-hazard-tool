'use strict';

var L = require('leaflet');


var Fullscreen = L.Control.extend({
  options: {
    position: 'topright'
  },

  _onControlClick: function () {
    this._mapdiv.classList.toggle('leaflet-map-fullscreen');
    this._map.invalidateSize();
  },

  onAdd: function (map) {
    var button,
        stop;

    this._map = map;
    this._mapdiv = map.getContainer();

    button = this._container = L.DomUtil.create('a',
        'leaflet-control leaflet-control-fullscreen');
    button.setAttribute('title', 'Toggle Fullscreen Map');

    stop = L.DomEvent.stopPropagation;

    L.DomEvent
        .on(button, 'click', stop)
        .on(button, 'mousedown', stop)
        .on(button, 'dblclick', stop)
        .on(button, 'click', L.DomEvent.preventDefault)
        .on(button, 'click', this._onControlClick, this)
        .on(button, 'click', this._refocusOnMap, this);

    return button;
  },

  onRemove: function (/*map*/) {
    this._map = null;
    this._mapdiv = null;
    this._container = null;
  }
});

L.Control.Fullscreen = Fullscreen;

L.Control.fullscreen = function (options) {
  return new Fullscreen(options);
};

module.exports = Fullscreen;
