'use strict';

var ActionsView = require('ActionsView'),
    Calculator = require('CurveCalculator'),
    CurveOutputView = require('curve/CurveOutputView'),
    DeaggOutputView = require('deagg/DeaggOutputView'),
    InputView = require('input/InputView'),
    LoaderView = require('LoaderView'),
    MapView = require('MapView'),

    Accordion = require('accordion/Accordion'),

    Collection = require('mvc/Collection'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');


var ApplicationView = function (params) {
  var _this,
      _initialize,

      // variables
      _accordion,
      _actionsEl,
      _actionsView,
      _inputEl,
      _inputView,
      _calculator,
      _computeCurveBtn,
      _curveOutput,
      _curveOutputEl,
      _curveOutputView,
      _deaggOutputEl,
      _deaggOutputView,
      _dependencyFactory,
      _editions,
      _hazardCurveEl,
      _hazardCurveView,
      _hazardSpectrumEl,
      _hazardSpectrumView,
      _loaderView,
      _mapEl,
      _mapView,
      _queued,
      _siteClasses,

      // methods
      _clearOutput,
      _initViewContainer,
      _onCalculate,
      _onEditionChange,
      _onLocationChange,
      _onRegionChange,
      _onTimeHorizonChange,
      _onVs30Change,
      _updateRegion,
      _updateVs30;


  _this = SelectedCollectionView(params);

  _initialize = function (params) {
    _initViewContainer();

    _dependencyFactory = params.dependencyFactory;

    _calculator = Calculator(params.webServices);

    _loaderView = LoaderView();

    _siteClasses = Collection(_dependencyFactory.getAllSiteClasses());
    _editions = Collection(_dependencyFactory.getAllEditions());

    _mapView = MapView({
      collection: _this.collection,
      dependencyFactory: _dependencyFactory,
      editions: _editions,
      el: _mapEl
    });

    _inputView = InputView({
      collection: _this.collection,
      dependencyFactory: _dependencyFactory,
      el: _inputEl
    });

    _actionsView = ActionsView({
      collection: _this.collection,
      el: _actionsEl,
      application: _this
    });

    _curveOutputView = CurveOutputView({
      collection: _this.collection,
      el: _curveOutputEl
    });

    _deaggOutputView = DeaggOutputView({
      collection: _this.collection,
      el: _deaggOutputEl
    });

    _curveOutputView.on('calculate', _onCalculate, _this);
    _deaggOutputView.on('calculate', _onCalculate, _this);
  };


  _clearOutput = function () {
    _this.model.set({curves: null});
  };

  _initViewContainer = function () {
    var el;

    el = _this.el;

    el.className = 'application-container';
    el.innerHTML = '';

    _mapEl = document.createElement('section');
    _inputEl = document.createElement('section');
    _curveOutputEl = document.createElement('section');
    _deaggOutputEl = document.createElement('section');
    _actionsEl = document.createElement('section');

    // By providing "el" to the Accordion, the sub-view containers are
    // automatically appended to this view's "el".
    _accordion = Accordion({
      el: el,
      accordions: [
        {
          classes: 'accordion-map',
          content: _mapEl,
          toggleText: '<h2 class="application-header" ' +
              'id="header-gis-hazard-layers">GIS Hazard Layers</h2>'
        },
        {
          content: _inputEl,
          toggleText: '<h2 class="application-header" ' +
              'id="header-input">Input</h2>'
        },
        {
          content: _curveOutputEl,
          toggleText: '<h2 class="application-header" ' +
              'id="header-curve">Hazard Curve</h2>'
        },
        {
          content: _deaggOutputEl,
          toggleText: '<h2 class="application-header" ' +
              'id="header-deagg">Deaggregation</h2>'
        }
      ]
    });
  };

  //
  // When changes are made to the currently selected model, values are updated
  // in sequence. When the final update is applied, if the model is ready,
  // then the hazard curve data is fetched. The general sequence of events is
  // as follows:
  //
  // (1) edition changes  --> reset vs30 collection
  //                          potentially set vs30 to null if current vs30 is
  //                          not supported by any region supported by the
  //                          edition that also contains the current
  //                          location.
  // (2) location changes --> reset vs30 collection
  //                          potentially set vs30 to null if current vs30 is
  //                          not supported by any region supported by the
  //                          edition that also contains the current
  //                          location.
  // (3) vs30 changes     --> update selected region
  // (4) region changes   --> run calcuation if all values are set
  //

  _onEditionChange = function (/*changes*/) {
    _updateVs30();
    _updateRegion();
    _clearOutput();
  };

  _onLocationChange = function (/*changes*/) {
    _updateVs30();
    _updateRegion();
    _clearOutput();
  };

  _onRegionChange = function (/*changes*/) {
    _clearOutput();
  };

  _onVs30Change = function (/*changes*/) {
    _updateRegion();
    _clearOutput();
  };

  _onTimeHorizonChange = function (/*changes*/) {
  };

  /**
   * Resets the collection of siteClasses based on what is available for
   * current selection of edition/location.
   */
  _updateVs30 = function () {
    var edition,
        ids,
        location,
        regions,
        siteClasses;

    ids = {};

    try {
      edition = _dependencyFactory.getEdition(_this.model.get('edition'));
      location = _this.model.get('location');
      regions = _dependencyFactory.getRegions(
          edition.get('supports').region, edition.id);

      regions.forEach(function (region) {
        if (region.contains(location)) {
          region.get('supports').vs30.forEach(function (vs30) {
            ids[vs30] = true;
          });
        }
      });

      siteClasses = _dependencyFactory.getSiteClasses(Object.keys(ids),
          _this.model.get('edition'));
    } catch (e) {
      // Just ignore, will set to use all site classes below
    }

    if (!siteClasses) {
      siteClasses = _dependencyFactory.getAllSiteClasses(
          _this.model.get('edition'));
    }

    _siteClasses.reset(siteClasses, {silent: true});
    _siteClasses.trigger('reset', {});
  };

  /**
   * Sets the region for the current model based on the currently selected
   * edition, location, and vs30.
   *
   */
  _updateRegion = function () {
    var edition,
        location,
        regions,
        vs30;

    vs30 = _this.model.get('vs30');

    if (vs30 === null) {
      // no vs30, can't choose a region...
      _this.model.set({'region': null});
      return;
    }

    edition = _dependencyFactory.getEdition(_this.model.get('edition'));
    location = _this.model.get('location');

    if (edition && location) {
      regions = _dependencyFactory.getRegions(
          edition.get('supports').region, edition.id);

      regions.some(function (region) {
        var supports = region.get('supports').vs30;

        if (region.contains(location) && supports.indexOf(vs30) !== -1) {
          // region contains location and supports the current vs30, select it
          _this.model.set({region: region.get('id')});
          return true; // break, essentially
        }
      });
    }
  };

  _onCalculate = function (data) {
    var calculator,
        request,
        serviceType;

    calculator = data.calculator;
    serviceType = data.serviceType;

    if (!_queued && calculator) {
      window.setTimeout(function () {
        if (_this.model.get('edition') && _this.model.get('location') &&
            _this.model.get('region') && _this.model.get('vs30')) {
          request = calculator.getResult(
              _dependencyFactory.getService(
                  _this.model.get('edition'), serviceType),
              _this.model,
              _loaderView.hide
            );
          _loaderView.show(request);
        }
        _queued = false;
      }, 0);
      _queued = true;
    }

  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _calculator.destroy();

    _computeCurveBtn.removeEventListener('click', _this.queueCalculation,
        _this);

    // sub-views
    _accordion.destroy();
    _actionsView.destroy();
    _inputView.destroy();
    _curveOutputView.destroy();
    _deaggOutputView.destroy();
    _mapView.destroy();

    // models/collections
    _editions.destroy();
    _siteClasses.destroy();

    // variables
    _accordion = null;
    _actionsEl = null;
    _actionsView = null;
    _inputEl = null;
    _inputView = null;
    _calculator = null;
    _computeCurveBtn = null;
    _curveOutput = null;
    _deaggOutputEl = null;
    _deaggOutputView = null;
    _dependencyFactory = null;
    _editions = null;
    _hazardCurveEl = null;
    _hazardCurveView = null;
    _hazardSpectrumEl = null;
    _hazardSpectrumView = null;
    _loaderView = null;
    _mapEl = null;
    _mapView = null;
    _queued = null;
    _siteClasses = null;

    // methods
    _clearOutput = null;
    _initViewContainer = null;
    _onEditionChange = null;
    _onLocationChange = null;
    _onRegionChange = null;
    _onTimeHorizonChange = null;
    _onVs30Change = null;
    _updateRegion = null;
    _updateVs30 = null;

    _initialize = null;
    _this = null;
  });

  _this.onCollectionDeselect = function () {
    _this.model.off('change:edition', _onEditionChange);
    _this.model.off('change:location', _onLocationChange);
    _this.model.off('change:region', _onRegionChange);
    _this.model.off('change:vs30', _onVs30Change);
    _this.model.off('change:timeHorizon', _onTimeHorizonChange);
    _this.model.off('change:curves', 'render', _this);

    _this.model = null;
    _this.render({model: null});
  };

  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();

    _this.model.on('change:edition', _onEditionChange);
    _this.model.on('change:location', _onLocationChange);
    _this.model.on('change:region', _onRegionChange);
    _this.model.on('change:vs30', _onVs30Change);
    _this.model.on('change:timeHorizon', _onTimeHorizonChange);
    _this.model.on('change:curves', 'render', _this);

    _this.render({model: _this.model});
  };

  _this.queueCalculation = function () {
    var request;
    if (!_queued) {
      window.setTimeout(function () {
        if (_this.model.get('edition') && _this.model.get('location') &&
            _this.model.get('region') && _this.model.get('vs30')) {
          request = _calculator.getResult(
              _dependencyFactory.getService(_this.model.get('edition')),
              _this.model,
              _loaderView.hide
            );
          _loaderView.show(request);
        }
        _queued = false;
      }, 0);
      _queued = true;
    }
  };

  _this.render = function (/*changes*/) {
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ApplicationView;
