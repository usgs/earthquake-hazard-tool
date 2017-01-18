/* global L */
'use strict';


var Grayscale = require('leaflet/layer/Grayscale'),
    HazardFault2008 = require('leaflet/layer/HazardFault2008'),
    HazardFault2014 = require('leaflet/layer/HazardFault2014'),
    Satellite = require('leaflet/layer/Satellite'),
    Street = require('leaflet/layer/Street'),
    Terrain = require('leaflet/layer/Terrain');


// --------------------------------------------------
// Public class
// --------------------------------------------------

var Z_BASELAYER_INDEX = 0,
    Z_OVERLAY_INDEX = 100,
    Z_DATASET_INDEX = 1000;

var LayerControl = L.Control.extend({
  options: {
    position: 'topright',
    baseLayers: {
      'terrain':{
        display: 'Terrain',
        layer: Terrain({
          zIndex: Z_BASELAYER_INDEX + 1
        })
      },
      'greyscale': {
        display: 'Grayscale',
        layer: Grayscale({
          zIndex: Z_BASELAYER_INDEX + 2
        })
      },
      'street': {
        display: 'Street',
        layer: Street({
          zIndex: Z_BASELAYER_INDEX + 3
        })
      },
      'aerial': {
        display: 'Aerial',
        layer: Satellite({
          zIndex: Z_BASELAYER_INDEX + 4
        })
      }
    },
    overlays: {
      'E2014R1': {
        display: 'USGS NSHM 2014 Rev. 1',
        layers: {
          'PGA-2P50-760': {
            display: 'PGA, 2% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
                'services/USpga250_2014/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 1,
              attribution: 'USGS - NSHMP'
            })
          },
          'SA0P2-2P50-760': {
            display: '0.2s, 2% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
                'services/US5hz250_2014/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 2,
              attribution: 'USGS - NSHMP'
            })
          },
          'SA1P0-2P50-760': {
            display: '1.0s, 2% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
                'services/US1hz250_2014/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 3,
              attribution: 'USGS - NSHMP'
            })
          },
          'PGA-10P50-760': {
            display: 'PGA, 10% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
                'services/USpga050_2014/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 4,
              attribution: 'USGS - NSHMP'
            })
          },
          'SA0P2-10P50-760': {
            display: '0.2s, 10% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
                'services/US5hz050_2014/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 5,
              attribution: 'USGS - NSHMP'
            })
          },
          'SA1P0-10P50-760': {
            display: '1.0s, 10% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.cr.usgs.gov/arcgis/rest/' +
                'services/US1hz050_2014/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 6,
              attribution: 'USGS - NSHMP'
            })
          }
        }
      },
      'E2008R3': {
        display: 'USGS NSHM 2008 Rev. 3',
        layers: {
          'PGA-2P50-760': {
            display: 'PGA, 2% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
                'services/USpga250_2008/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 7,
              attribution: 'USGS - NSHMP'
            })
          },
          'SA0P2-2P50-760': {
            display: '0.2s, 2% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
                'services/US5hz250_2008/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 8,
              attribution: 'USGS - NSHMP'
            })
          },
          'SA1P0-2P50-760': {
            display: '1.0s, 2% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
                'services/US1hz250_2008/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 9,
              attribution: 'USGS - NSHMP'
            })
          },
          'PGA-10P50-760': {
            display: 'PGA, 10% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
                'services/USpga050_2008/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 10,
              attribution: 'USGS - NSHMP'
            })
          },
          'SA0P2-10P50-760': {
            display: '0.2s, 10% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
                'services/US5hz050_2008/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 11,
              attribution: 'USGS - NSHMP'
            })
          },
          'SA1P0-10P50-760': {
            display: '1.0s, 10% in 50 Years, 760 m/s',
            layer: L.tileLayer('http://geohazards.usgs.gov/arcgis/rest/' +
                'services/US1hz050_2008/MapServer/tile/{z}/{y}/{x}', {
              zIndex: Z_OVERLAY_INDEX + 12,
              attribution: 'USGS - NSHMP'
            })
          }
        }
      }
    },
    faults: {
      'E2014R1': {
        display: 'USGS NSHM 2014 Rev. 1',
        layer: HazardFault2014({
          clickable: true,
          zIndex: Z_DATASET_INDEX
        })
      },
      'E2008R3': {
        display: 'USGS NSHM 2008 Rev. 3',
        layer: HazardFault2008({
          clickable: true,
          zIndex: Z_DATASET_INDEX + 1
        })
      }
    }
  },

  initialize: function (/*params*/) {

  },

  onAdd: function (map) {
    var button,
        container,
        content;

    this._map = map;

    container = L.DomUtil.create('div', 'hazard-layer-control');
    container.setAttribute('title', 'Select Overlays');

    button = L.DomUtil.create('a', 'hazard-layer-control-toggle', container);
    content = L.DomUtil.create('div', 'hazard-layer-control-content', container);

    L.DomEvent
        .on(container, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(container, 'click', L.DomEvent.stopPropagation);

    L.DomEvent
        .on(button, 'click', this._onClick, this);


    this._container = container;
    this._button = button;
    this._content = content;

    this._createControlContent();
    this._onBaselayerChange();

    return container;
  },

  onRemove: function (/*map*/) {
    var container;

    container = this._container;

    L.DomEvent
        .off(container, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .off(container, 'click', L.DomEvent.stopPropagation)
        .off(container, 'click', this._onClick, this);

    this._map = null;
  },



  _createBaseLayerOptions: function () {
    var baseLayersInfo;

    baseLayersInfo = this.options.baseLayers;

    return this._layerOptionLoop(baseLayersInfo);


  },

  _createControlContent: function () {
    this._content.innerHTML = [
      '<label>',
        'Base Layer',
        '<select class="layer-control-base-layer">',
          this._createBaseLayerOptions(),
        '</select>',
      '</label>',
      '<label>',
        'Overlays',
        '<select class="layer-control-overlays">',
          '<option label="None"></option>',
          this._createOverlayersOptions(),
        '</select>',
      '</label>',
      '<label>',
        'Faults',
        '<select class="layer-control-faults">',
          '<option label="None"></option>',
          this._createFaultsLayersOptions(),
        '</select>',
      '</label>'
    ].join('');

    this._baselayers = this._content.querySelector('.layer-control-base-layer');
    this._overlays = this._content.querySelector('.layer-control-overlays');
    this._faults = this._content.querySelector('.layer-control-faults');

    L.DomEvent.on(this._baselayers, 'change', this._onBaselayerChange, this);
    L.DomEvent.on(this._overlays, 'change', this._onOverlayChange, this);
    L.DomEvent.on(this._faults, 'change', this._onFaultsChange, this);
  },

  _createFaultsLayersOptions: function () {
    var faultLayersInfo;

    faultLayersInfo = this.options.faults;

    return this._layerOptionLoop(faultLayersInfo);
  },

  _createOverlayersOptions: function () {
    var index,
        layersInfo,
        overlayInfo,
        overlayLayersInfo;

    overlayInfo = [];
    overlayLayersInfo = this.options.overlays;

    for (index in overlayLayersInfo) {
      layersInfo = overlayLayersInfo[index];

      overlayInfo.push([
        '<optgroup label="',layersInfo.display,'" data-value="',index,'">',
          this._layerOptionLoop(layersInfo.layers),
        '</optgroup>'
      ].join(''));
    }

    return overlayInfo;
  },

  _layerOptionLoop: function (layers) {
    var key,
        layerInfo;

    layerInfo = [];

    for (key in layers) {
      layerInfo.push([
        '<option value="',key,'">',
          layers[key].display,
        '</option>'
      ].join(''));
    }

    return layerInfo.join('');
  },

  _onBaselayerChange: function () {
    var layer,
        value;

    value = this._baselayers.value;
    layer = this.options.baseLayers[value];

    if (this._currentBaselayer) {
      this._map.removeLayer(this._currentBaselayer);
    }

    this._currentBaselayer = layer.layer;
    this._map.addLayer(this._currentBaselayer);
  },

  _onFaultsChange: function () {
    var layer,
        value;

    value = this._faults.value;
    layer = this.options.faults[value];

    if (value === '') {
      this._map.removeLayer(this._currentFaultsLayer);
    } else {
      if (this._currentFaultsLayer) {
        this._map.removeLayer(this._currentFaultsLayer);
      }

      this._currentFaultsLayer = layer.layer;
      this._map.addLayer(this._currentFaultsLayer);
    }
  },

  _onOverlayChange: function (evt) {
    var layer,
        layerGroupValue,
        value;

    value = this._overlays.value;

    if (value === '') {
      this._map.removeLayer(this._currentOverlay);
    } else {
      layerGroupValue = evt.target.querySelector('[value="'+value+'"]')
          .parentNode.getAttribute('data-value');
      layer = this.options.overlays[layerGroupValue].layers[value];

      if (this._currentOverlay) {
        this._map.removeLayer(this._currentOverlay);
      }

      this._currentOverlay = layer.layer;
      this._map.addLayer(this._currentOverlay);
    }
  },

  _onClick: function (/*evt*/) {

    this._container.classList.add('show');

    L.DomEvent
        .on(this._container, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(this._map._container, 'click', this._onMapClick, this);

  },

  _onMapClick: function (/*evt*/) {

    this._container.classList.remove('show');

    L.DomEvent
        .off(this._container, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .off(this._map._container, 'click', this._onMapClick, this);
  }
});

L.Control.hazardLayerControl = function (options) {
  return new LayerControl(options);
};

module.exports = LayerControl;
