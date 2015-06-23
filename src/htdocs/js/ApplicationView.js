'use strict';

var Analysis = require('Analysis'),
    BasicInputsView = require('mvc/SelectedCollectionView'), // TODO
    HazardCurveView = require('mvc/SelectedCollectionView'), // TODO
    HazardSpectrumView = require('mvc/SelectedCollectionView'), // TODO
    MapView = require('MapView'),
    TimeHorizonView = require('mvc/SelectedCollectionView'), // TODO

    Collection = require('mvc/Collection'),
    View = require('mvc/View');


var ApplicationView = function (params) {
  var _this,
      _initialize,

      // variables
      _analysisCollection,
      _basicInputsEl,
      _basicInputsView,
      _hazardCurveEl,
      _hazardCurveView,
      _hazardSpectrumEl,
      _hazardSpectrumView,
      _mapEl,
      _mapView,
      _timeHorizonEl,
      _timeHorizonView,

      // methods
      _initViewContainer;


  _this = View(params);

  _initialize = function (/*params*/) {
    _initViewContainer();

    _analysisCollection = Collection([Analysis()]);
    _analysisCollection.select(_analysisCollection.data()[0]);

    _basicInputsView = BasicInputsView({
      collection: _analysisCollection,
      el: _basicInputsEl
    });

    _mapView = MapView({
      collection: _analysisCollection,
      el: _mapEl
    });

    _timeHorizonView = TimeHorizonView({
      collection: _analysisCollection,
      el: _timeHorizonEl
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
      '<div class="row">',
        '<section class="application-basic-inputs column one-of-two">',
        '</section>',
        '<section class="application-map column one-of-two">',
        '</section>',
      '</div>',
      '<div class="row">',
        '<section class="application-time-horizon-input column one-of-one">',
        '</section>',
      '</div>',
      '<div class="row">',
        '<section class="application-hazard-curve column one-of-two">',
        '</section>',
        '<section class="application-hazard-spectrum column one-of-two">',
        '</section>',
      '</div>',
    ].join('');

    _basicInputsEl = el.querySelector('.application-basic-inputs');
    _mapEl = el.querySelector('.application-map');
    _timeHorizonEl = el.querySelector('.application-time-horizon-input');
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
    _timeHorizonView.destroy();

    // variables
    _analysisCollection = null;
    _basicInputsEl = null;
    _basicInputsView = null;
    _hazardCurveEl = null;
    _hazardCurveView = null;
    _hazardSpectrumEl = null;
    _hazardSpectrumView = null;
    _mapEl = null;
    _mapView = null;
    _timeHorizonEl = null;
    _timeHorizonView = null;

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
