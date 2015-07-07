'use strict';

var L = require('leaflet');


var Fullscreen = L.Control.extend({
  options: {
    position: 'topright'
  },

  _onKeyUp: function (evt) {
    if (evt.keyCode === 27) {
      this._onControlClick();
    }
  },

  _onControlClick: function () {
    var classList;

    classList = this._mapdiv.classList;

    if (classList.contains('leaflet-map-fullscreen')) {
      // Currently in fullscreen mode, exiting, so remove ESC handler
      L.DomEvent.off(document, 'keyup', this._onKeyUp, this);
    } else {
      // Currently in in-line mode, entering fullscreen, so add ESC handler
      L.DomEvent.on(document, 'keyup', this._onKeyUp, this);
    }

    classList.toggle('leaflet-map-fullscreen');
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
    button.innerHTML = '&#9713;'; // fullscreen icon

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
    var button,
        stop;

    button = this._container;
    stop = L.DomEvent.stopPropagation;

    L.DomEvent
        .off(button, 'click', stop)
        .off(button, 'mousedown', stop)
        .off(button, 'dblclick', stop)
        .off(button, 'click', L.DomEvent.preventDefault)
        .off(button, 'click', this._onControlClick, this)
        .off(button, 'click', this._refocusOnMap, this);

    this._map = null;
    this._mapdiv = null;
    this._container = null;
  }
});

L.Control.Fullscreen = Fullscreen;

L.control.fullscreen = function (options) {
  return new Fullscreen(options);
};

module.exports = Fullscreen;
