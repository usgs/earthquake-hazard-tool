'use strict';

var Layers = require('map/Layers'),
    LayerControl = require('map/LayerControl'),

    L = require('leaflet');

var map;

map = L.map(document.querySelector('.map-container'), {
  mouseWheelZoom: false
});

map.addControl(new LayerControl(Layers));
map.fitBounds([[24.6, -125.0], [50.0, -65.0]]);
