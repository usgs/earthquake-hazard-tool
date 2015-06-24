'use strict';

var BasicInputsView = require('BasicInputsView'),
    Calculator = require('Calculator'),
    DependencyFactory = require('DependencyFactory'),
    HazardCurveView = require('mvc/SelectedCollectionView'), // TODO
    HazardSpectrumView = require('mvc/SelectedCollectionView'), // TODO
    MapView = require('MapView'),

    SelectedCollectionView = require('mvc/SelectedCollectionView');


var ApplicationView = function (params) {
  var _this,
      _initialize,

      // variables
      _basicInputsEl,
      _basicInputsView,
      _calculator,
      _dependencyFactory,
      _destroyCalculator,
      _hazardCurveEl,
      _hazardCurveView,
      _hazardSpectrumEl,
      _hazardSpectrumView,
      _mapEl,
      _mapView,

      // methods
      _initViewContainer;


  _this = SelectedCollectionView(params);

  _initialize = function (params) {
    _initViewContainer();

    _dependencyFactory = params.dependencyFactory ||
        DependencyFactory.getInstance();

    _calculator = params.calculator;
    if (!_calculator) {
      _calculator = Calculator();
      _destroyCalculator = true;
    }


    _basicInputsView = BasicInputsView({
      collection: _this.collection,
      el: _basicInputsEl
    });

    _mapView = MapView({
      collection: _this.collection,
      el: _mapEl
    });

    _hazardCurveView = HazardCurveView({
      collection: _this.collection,
      el: _hazardCurveEl
    });

    _hazardSpectrumView = HazardSpectrumView({
      collection: _this.collection,
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
    if (_destroyCalculator) {
      _calculator.destroy();
    }

    // sub-views
    _basicInputsView.destroy();
    _hazardCurveView.destroy();
    _hazardSpectrumView.destroy();
    _mapView.destroy();

    // variables
    _basicInputsEl = null;
    _basicInputsView = null;
    _calculator = null;
    _dependencyFactory = null;
    _destroyCalculator = null;
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

  _this.render = function () {
    // TODO :: Use generalized method to check if analysis is ready
    var analysisReady;

    analysisReady = function (a) {
      return (
        a.get('edition') !== null &&
        a.get('region') !== null &&
        a.get('location') !== null &&
        a.get('vs30') !== null
      );
    };

    if (_this.model && analysisReady(_this.model)) {
      _calculator.getResult('staticcurve', _this.model);
    }
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ApplicationView;
