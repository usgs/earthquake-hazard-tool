'use strict';

var EditionView = require('EditionView'),
    ContourTypeView = require('ContourTypeView'),
    SpectralPeriodView = require('SpectralPeriodView'),
    TimeHorizonSelectView = require('TimeHorizonSelectView'),

    L = require('leaflet/Leaflet'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    Model = require('mvc/Model'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');


// --------------------------------------------------
// Private inner class
// --------------------------------------------------

var LayerChooser = function (params) {
  var _this,
      _initialize,

      _baseLayers,
      _baseLayerView,
      _baseLayerCollection,
      _contourTypeView,
      _datasets,
      _dependencyFactory,
      _editionView,
      _editions,
      _spectralPeriodView,
      _map,
      _overlays,
      _timeHorizonSelectView,
      _selectedOverlay,

      _getSelectedOverlay,
      _initCollections,
      _initViews,
      _onBaseLayerDeselect,
      _onBaseLayerSelect,
      _onDatasetChange,
      _onOverlayDeselect,
      _onOverlaySelect;


  _this = SelectedCollectionView(params);

  _initialize = function (params) {
    params = Util.extend({
      baseLayers: [
        {
          id: 1,
          value: 'Nat Geo',
          layer: L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/' +
              'services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x};.jpg')
        }
      ],
      overlays: [],
      datasets: []
    }, params);

    _this.collection = params.collection || Collection();

    _baseLayers = params.baseLayers;
    _datasets = params.datasets;
    _dependencyFactory = params.dependencyFactory;
    _editions = params.editions;
    _overlays = params.overlays;

    _initCollections();
    _initViews();

    if (!_baseLayerCollection.getSelected()) {
      _baseLayerCollection.select(_baseLayerCollection.data()[0]);
    }
  };

  _getSelectedOverlay = function (edition, type, imt, period, vs30) {
    var i,
        len,
        overlay;

    if (!edition || !type || !imt || !period || !vs30) {
      return null;
    }

    for (i = 0, len = _overlays.length; i < len; i++) {
      overlay = _overlays[i];

      if (overlay.edition === edition &&
          overlay.type === type &&
          overlay.imt === imt &&
          overlay.period === _timeHorizonSelectView.getTimeHorizonId(period) &&
          overlay.vs30 === vs30) {
        return overlay;
      }
    }

    return null;
  };

  _initCollections = function () {
    _baseLayerCollection = Collection(_baseLayers.map(function (layer) {
      return Model(layer);
    }));

    // Select first option in base layer collection
    _baseLayerCollection.select(_baseLayerCollection.data()[0]);

    // Bind listeners
    _baseLayerCollection.on('select', _onBaseLayerSelect);
    _baseLayerCollection.on('deselect', _onBaseLayerDeselect);
  };

  _initViews = function () {
    var format,
        fragment,
        input,
        label;

    fragment = document.createDocumentFragment();
    format = function (item) {
      return item.get('value');
    };

    label = fragment.appendChild(document.createElement('h3'));
    label.innerHTML = 'Base Layer';

    label = fragment.appendChild(document.createElement('label'));
    _baseLayerView = CollectionSelectBox({
      el: fragment.appendChild(document.createElement('select')),
      collection: _baseLayerCollection,
      format: format
    });

    label = fragment.appendChild(document.createElement('h3'));
    label.innerHTML = 'Overlays';

    label = fragment.appendChild(document.createElement('label'));
    label.innerHTML = 'Select data edition';
    _editionView = EditionView({
      el: fragment.appendChild(document.createElement('div')),
      editions: _editions,
      includeBlankOption: false
    });

    label = fragment.appendChild(document.createElement('label'));
    label.innerHTML = 'Select Overlay Type';
    _contourTypeView = ContourTypeView({
      el: fragment.appendChild(document.createElement('div')),
      collection: _this.collection,
      includeBlankOption: true,
      blankOption: {
        'text': 'None',
        'value': -1
      }
    });

    label = fragment.appendChild(document.createElement('label'));
    label.innerHTML = 'Select intensity measure type';
    _spectralPeriodView = SpectralPeriodView({
      el: fragment.appendChild(document.createElement('div')),
      collection: _this.collection,
      factory: _dependencyFactory,
      includeBlankOption: false
    });

    label = fragment.appendChild(document.createElement('label'));
    label.innerHTML = 'Select return period';
    _timeHorizonSelectView = TimeHorizonSelectView({
      el: fragment.appendChild(document.createElement('div')),
      collection: _this.collection,
      includeBlankOption: false
    });

    label = fragment.appendChild(document.createElement('h3'));
    label.innerHTML = 'Datasets';

    _datasets.forEach(function (dataset) {
      input = fragment.appendChild(document.createElement('input'));
      input.setAttribute('type', 'checkbox');
      input.setAttribute('id', 'dataset-' + dataset.id);
      input.setAttribute('value', dataset.value);

      label = fragment.appendChild(document.createElement('label'));
      label.setAttribute('for', 'dataset-' + dataset.id);
      label.innerHTML = dataset.value;

      dataset.input = input;
      dataset.input.addEventListener('change', _onDatasetChange);
    });

    _this.el.classList.add('contour-layer-control');
    _this.el.classList.add('leaflet-control');
    _this.el.classList.add('vertical');
    _this.el.appendChild(fragment);
  };

  _onBaseLayerDeselect = function (layer) {
    var mapLayer = layer.get('layer');
    if (_map) {
      if (mapLayer._map) {
        _map.removeLayer(mapLayer);
      }
    }
  };

  _onBaseLayerSelect = function (layer) {
    var mapLayer = layer.get('layer');
    if (_map) {
      if (!mapLayer._map) {
        _map.addLayer(mapLayer);
      }
    }
  };

  _onDatasetChange = function () {
    var edition;

    // read edition off selected item in the collection
    if (_this.collection.getSelected()) {
      edition = _this.collection.getSelected().get('edition');
    }

    if (_map && edition) {

      _datasets.forEach(function (dataset) {
        if (dataset.input.checked) {
          // Make sure the corresponding layer is on the map
          dataset.overlays.forEach(function (overlay) {
            if (overlay.layer._map) {
              if (overlay.edition !== edition) {
                _map.removeLayer(overlay.layer);
              }
            } else {
              if (overlay.edition === edition) {
                _map.addLayer(overlay.layer);
              }
            }
          });
        } else {
          // Make sure all layers are off the map
          dataset.overlays.forEach(function (overlay) {
            if (overlay.layer._map) {
              _map.removeLayer(overlay.layer);
            }
          });
        }
      });
    }
  };

  _onOverlayDeselect = function () {
    // TODO :: Anything?
  };

  _onOverlaySelect = function () {
    var selected,
        selectedOverlay;

    selected = _this.collection.getSelected();

    if (_map && selected) {
      selectedOverlay = _getSelectedOverlay(
          selected.get('edition'),
          selected.get('contourType'),
          selected.get('imt'),
          selected.get('timeHorizon'),
          selected.get('vs30')
        );

      if (selectedOverlay === _selectedOverlay) {
        // already selected, ignore
        return;
      } else {
        if (_selectedOverlay) {
          _map.removeLayer(_selectedOverlay.layer);
          _selectedOverlay = null;
        }

        if (selectedOverlay) {
          _selectedOverlay = selectedOverlay;
          _map.addLayer(_selectedOverlay.layer);
        }
      }
    }

    // Update which overlays are shown by default
    _onDatasetChange();
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _this.setMap(null);

    _getSelectedOverlay = null;
    _initCollections = null;
    _initViews = null;
    _onBaseLayerDeselect = null;
    _onBaseLayerSelect = null;
    _onDatasetChange = null;
    _onOverlayDeselect = null;
    _onOverlaySelect = null;

    _baseLayers = null;
    _baseLayerView = null;
    _baseLayerCollection = null;
    _contourTypeView = null;
    _datasets = null;
    _dependencyFactory = null;
    _editionView = null;
    _spectralPeriodView = null;
    _map = null;
    _overlays = null;
    _timeHorizonSelectView = null;
    _selectedOverlay = null;

    _initialize = null;
    _this = null;
  });

  /**
   * unset the event bindings for the collection
   */
  _this.onCollectionDeselect = function () {
    _this.model.off('change', _onOverlaySelect);
    _this.model = null;
    _onOverlaySelect();
  };

  /**
   * set event bindings for the collection
   */
  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();
    _this.model.on('change', _onOverlaySelect);
    _onOverlaySelect();
  };

  _this.setMap = function (map) {
    _map = map;
    _onBaseLayerSelect(_baseLayerCollection.getSelected());
    _onOverlaySelect();
  };

  _initialize(params);
  params = null;
  return _this;
};


// --------------------------------------------------
// Public class
// --------------------------------------------------

var LayerControl = L.Control.extend({
  options: {
    position: 'topright'
  },

  initialize: function (params) {
    this._layerChooser = LayerChooser(params);
  },

  onAdd: function (map) {
    var container;

    this._map = map;
    this._layerChooser.setMap(map);

    container = L.DomUtil.create('div', 'hazard-layer-control');
    container.setAttribute('title', 'Select Overlays');

    L.DomEvent
        .on(container, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(container, 'click', L.DomEvent.stopPropagation)
        .on(container, 'click', this._onClick, this);

    this._container = container;
    this._container.appendChild(this._layerChooser.el);

    return container;
  },

  onRemove: function (/*map*/) {
    var container;

    this._layerChooser.setMap(null);

    container = this._container;

    L.DomEvent
        .off(container, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .off(container, 'click', L.DomEvent.stopPropagation)
        .off(container, 'click', this._onClick, this);

    this._map = null;
  },

  _onClick: function (/*evt*/) {

    this._container.classList.add('show-contour-layer-control');

    L.DomEvent
        .on(this._container, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(this._map._container, 'click', this._onMapClick, this);

  },

  _onMapClick: function (/*evt*/) {

    this._container.classList.remove('show-contour-layer-control');

    L.DomEvent
        .off(this._container, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .off(this._map._container, 'click', this._onMapClick, this);
  }
});

L.Control.hazardLayerControl = function (options) {
  return new LayerControl(options);
};

module.exports = LayerControl;
