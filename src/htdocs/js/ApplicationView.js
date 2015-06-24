'use strict';

var Analysis = require('Analysis'),
    BasicInputsView = require('BasicInputsView'),
    DependencyFactory = require('DependencyFactory'),
    HazardCurveView = require('mvc/SelectedCollectionView'), // TODO
    HazardSpectrumView = require('mvc/SelectedCollectionView'), // TODO
    MapView = require('MapView'),

    Collection = require('mvc/Collection'),
    View = require('mvc/View');


var ApplicationView = function (params) {
  var _this,
      _initialize,

      // variables
      _analysisCollection,
      _basicInputsEl,
      _basicInputsView,
      _dependencyFactory,
      _destroyDependencyFactory,
      _hazardCurveEl,
      _hazardCurveView,
      _hazardSpectrumEl,
      _hazardSpectrumView,
      _mapEl,
      _mapView,

      // methods
      _initViewContainer;


  _this = View(params);

  _initialize = function (params) {
    _initViewContainer();

    _dependencyFactory = params.dependencyFactory;
    if (!_dependencyFactory) {
      _dependencyFactory = DependencyFactory.getInstance();
      _destroyDependencyFactory = true;
    }

    _analysisCollection = Collection([Analysis({
      edition: _dependencyFactory.getAllEditions()[0],
      vs30: _dependencyFactory.getSiteClass(3),
      timeHorizon: 2475,
    })]);
    _analysisCollection.select(_analysisCollection.data()[0]);
    console.log(_analysisCollection.getSelected().toJSON());

    _basicInputsView = BasicInputsView({
      collection: _analysisCollection,
      el: _basicInputsEl
    });

    _mapView = MapView({
      collection: _analysisCollection,
      el: _mapEl
    });

    _hazardCurveView = HazardCurveView({
      collection: _analysisCollection,
      el: _hazardCurveEl
    });

    _hazardSpectrumView = HazardSpectrumView({
      collection: _analysisCollection,
      el: _hazardCurveEl
    });
  };


  _initViewContainer = function () {
    var el;

    el = _this.el;

    el.className = 'application-container';

    el.innerHTML = [
      '<div class="flexible">',
        '<section class="application-basic-inputs"></section>',
        '<section class="application-map"></section>',
      '</div>',
      '<div class="row">',
        '<section class="application-hazard-curve column one-of-two">',
        '</section>',
        '<section class="application-hazard-spectrum column one-of-two">',
        '</section>',
      '</div>'
    ].join('');

    _basicInputsEl = el.querySelector('.application-basic-inputs');
    _mapEl = el.querySelector('.application-map');
    _hazardCurveEl = el.querySelector('.application-hazard-curve');
    _hazardSpectrumEl = el.querySelector('.application-hazard-spectrum');
  };


  _this.destroy = function () {
    _analysisCollection.destroy();

    // sub-views
    _basicInputsView.destroy();
    _hazardCurveView.destroy();
    _hazardSpectrumView.destroy();
    _mapView.destroy();

    if (_destroyDependencyFactory) {
      _dependencyFactory.destroy();
    }

    // variables
    _analysisCollection = null;
    _basicInputsEl = null;
    _basicInputsView = null;
    _dependencyFactory = null;
    _destroyDependencyFactory = null;
    _hazardCurveEl = null;
    _hazardCurveView = null;
    _hazardSpectrumEl = null;
    _hazardSpectrumView = null;
    _mapEl = null;
    _mapView = null;

    // methods
    _initViewContainer = null;

    _initialize = null;
    _this = null;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ApplicationView;
