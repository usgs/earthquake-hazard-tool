'use strict';

var Analysis = require('Analysis'),
    AnalysisCollectionView = require('AnalysisCollectionView'),
    Calculator = require('CurveCalculator'),
    CurveOutputView = require('curve/CurveOutputView'),
    DeaggOutputView = require('deagg/DeaggOutputView'),
    ErrorsView = require('ErrorsView'),
    InputView = require('input/InputView'),
    LoaderView = require('LoaderView'),
    MapView = require('MapView'),

    Accordion = require('accordion/Accordion'),

    Collection = require('mvc/Collection'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');


var ValidateInputs = function (type, analysis) {
  var _this,
      _initialize,

      _errors,
      _errorsView;


  _this = {};

  _initialize = function () {
    _errors = {};
    _errorsView = ErrorsView();

    if (type !== undefined && type !== null &&
        analysis !== undefined && analysis !== null) {
      _this.validate();
    }
  };

  /**
   * Build an input keyed object with an array of errors for each input.
   */
  _this.addErrors = function (e) {
    _errors[e.input] = e.messages;
  };

  _this.destroy = Util.compose(_this.destroy, function () {
    // variables
    _errors = null;
    _errorsView = null;

    _initialize = null;
    _this = null;
  });
  /**
   * Remove errors from _errors for the input type passed in.
   */
  _this.removeErrors = function (e) {
    if (_errors[e.input]) {
      _errors[e.input] = null;
    }
  };

  _this.validate = function () {
    _errors = {};

    _this.validateEdition(analysis.getEdition());

    _this.validateLocation(analysis.getLocation());

    _this.validateSiteClass(analysis.getVs30(), analysis.getEdition());

    _this.validateSpectralPeriod(type, analysis.getSpectralPeriod());

    _this.validateTimeHorizon(analysis.get('timeHorizon'));

    analysis.set({
      errors: _errors
    });
  };

  _this.validateEdition = function (edition) {
    var editionError;

    editionError = {
      input: 'edition',
      messages: ['Please select an Edition.']
    };

    if (edition === null) {
      _errorsView.addErrors(editionError);
      _this.addErrors(editionError);
      return false;
    } else {
      _errorsView.removeErrors(editionError);
      _this.removeErrors(editionError);
      return true;
    }
  };

  _this.validateLocation = function (location) {
    var locationError;

    locationError = {
      input: 'location',
      messages: [
        'Location is required. The "Chose location using a map" link can assist you.'
      ]
    };

    if (location === null) {
      _errorsView.addErrors(locationError);
      _this.addErrors(locationError);
    } else {
      _errorsView.removeErrors(locationError);
      _this.removeErrors(locationError);
    }
  };

  _this.validateSiteClass = function (siteClass, edition) {
    var siteClassError;

    siteClassError = {
      input: 'siteClass',
      messages: ['Please select a Site Class.']
    };

    if (_this.validateEdition(edition)) {
      if (siteClass === null) {
        _errorsView.addErrors(siteClassError);
        _this.addErrors(siteClassError);
      } else {
        _errorsView.removeErrors(siteClassError);
        _this.removeErrors(siteClassError);
      }
    }
  };

  _this.validateSpectralPeriod = function (type, spectralPeriod) {
    var spectralPeriodError;

    spectralPeriodError = {
      input: 'spectralPeriod',
      messages: ['Please select a Spectral Period.']
    };

    if (type === 'deaggregation') {
      if (spectralPeriod === null) {
        _errorsView.addErrors(spectralPeriodError);
        _this.addErrors(spectralPeriodError);
      } else {
        _errorsView.removeErrors(spectralPeriodError);
        _this.removeErrors(spectralPeriodError);
      }
    }
  };

  _this.validateTimeHorizon = function (timeHorizon) {
    var timeHorizonError;

    timeHorizonError = {
      input: 'timeHorizon',
      messages: ['Time Horizon must be a non-negative integer.']
    };

    if (timeHorizon === null || timeHorizon < 0) {
      _errorsView.addErrors(timeHorizonError);
      _this.addErrors(timeHorizonError);
    } else {
      _errorsView.removeErrors(timeHorizonError);
      _this.removeErrors(timeHorizonError);
    }
  };


  _initialize();
  return _this;
};

var ApplicationView = function (params) {
  var _this,
      _initialize,

      // variables
      _accordion,
      _analysisCollectionEl,
      _analysisCollectionView,
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
      _newButton,
      _mapEl,
      _mapView,
      _queued,
      _serviceType,
      _siteClasses,

      // methods
      _clearOutput,
      _initViewContainer,
      _onCalculate,
      _onEditionChange,
      _onLocationChange,
      _onNewButtonClick,
      _onRegionChange,
      _onTimeHorizonChange,
      _onVs30Change,
      _setErrorInput,
      _setErrorSelect,
      _setInputErrors,
      _updateRegion,
      _updateVs30,
      _validateInputs;


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

    _curveOutputView = CurveOutputView({
      collection: _this.collection,
      el: _curveOutputEl
    });

    _deaggOutputView = DeaggOutputView({
      collection: _this.collection,
      el: _deaggOutputEl
    });

    _analysisCollectionView = AnalysisCollectionView({
      collection: _this.collection,
      el: _analysisCollectionEl
    });

    _validateInputs = ValidateInputs(_serviceType, _this.model);

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
    _analysisCollectionEl = document.createElement('section');

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
        },
        {
          content: _analysisCollectionEl,
          classes: 'analysis-collection-view',
          toggleText: '<h2 class="application-header" ' +
              'id="header-history">History</h2>' +
              '<button class="analysis-collection-view-new">New</button>'
        }
      ]
    });

    _newButton  = _this.el.querySelector('.analysis-collection-view-new');
    _newButton.addEventListener('click', _onNewButtonClick);
  };

  /**
   * Adds new analysis to the collection and selects the analysis
   */
  _onNewButtonClick = function (evt) {
    var analysis;

    analysis = Analysis();
    _this.collection.add(analysis);
    _this.collection.select(analysis);

    evt.cancelBubble = true;
    return evt.preventDefault();
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

    _validateInputs.validateEdition(_this.model.getEdition());
  };

  _onLocationChange = function (/*changes*/) {
    _updateVs30();
    _updateRegion();
    _clearOutput();

    _validateInputs.validateLocation(_this.model.getLocation());
  };

  _onRegionChange = function (/*changes*/) {
    _clearOutput();
  };

  _onVs30Change = function (/*changes*/) {
    _updateRegion();
    _clearOutput();

    _validateInputs.validateSiteClass(_this.model.getVs30(), _this.model.getEdition());
  };

  _onTimeHorizonChange = function (/*changes*/) {
    _validateInputs.validateTimeHorizon(_this.model.get('timeHorizon'));
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
        request;


    calculator = data.calculator;
    _serviceType = data.serviceType;

    _validateInputs = ValidateInputs(_serviceType, _this.model);

    if (!_queued && calculator) {
      window.setTimeout(function () {
        if (_this.model.get('edition') && _this.model.get('location') &&
            _this.model.get('region') && _this.model.get('vs30')) {
          request = calculator.getResult(
              _dependencyFactory.getService(
                  _this.model.get('edition'), _serviceType),
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

  _setErrorInput = function (errors, view, label) {
    if (errors) {
      view.classList.add('usa-input-error');

      label.classList.add('usa-input-error-label');
    } else {
      if (view.classList.contains('usa-input-error')) {
        view.classList.remove('usa-input-error');
      }

      if (label.classList.contains('usa-input-error-label')) {
        label.classList.remove('usa-input-error-label');
      }
    }
  };

  _setErrorSelect = function (errors, view, label) {
    if (errors) {
      view.classList.add('usa-select-error');

      label.classList.add('usa-select-error-label');
    } else {
      if (view.classList.contains('usa-select-error')) {
        view.classList.remove('usa-select-error');
      }

      if (label.classList.contains('usa-select-error-label')) {
        label.classList.remove('usa-select-error-label');
      }
    }
  };

  _setInputErrors = function () {
    var editionLabel,
        editionView,
        errors,
        locationLabels,
        locationView,
        siteClassLabel,
        siteClassView,
        spectralPeriodLabel,
        spectralPeriodView,
        timeHorizonLabel,
        timeHorizonView;

    errors = _this.model.get('errors');

    editionView = _inputEl.querySelector('.edition');
    editionLabel = editionView.querySelector('label');

    locationView = _inputEl.querySelector('.input-location-view');
    locationLabels = locationView.querySelectorAll('label');

    siteClassView = _inputEl.querySelector('.site-class');
    siteClassLabel = siteClassView.querySelector('label');

    spectralPeriodView = _inputEl.querySelector('.spectral-period');
    spectralPeriodLabel = spectralPeriodView.querySelector('label');

    timeHorizonView = _inputEl.querySelector('.input-time-horizon-view');
    timeHorizonLabel = timeHorizonView.querySelector('label');

    _setErrorSelect(errors.edition, editionView, editionLabel);

    _setErrorSelect(errors.location, locationView, locationLabels[0]);
    _setErrorSelect(errors.location, locationView, locationLabels[1]);

    _setErrorSelect(errors.siteClass, siteClassView, siteClassLabel);

    _setErrorSelect(errors.spectralPeriod, spectralPeriodView,
        spectralPeriodLabel);

    _setErrorInput(errors.timeHorizon, timeHorizonView, timeHorizonLabel);
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _calculator.destroy();

    _newButton.removeEventListener('click', _onNewButtonClick);
    _computeCurveBtn.removeEventListener('click', _this.queueCalculation,
        _this);

    // sub-views
    _accordion.destroy();
    _inputView.destroy();
    _curveOutputView.destroy();
    _deaggOutputView.destroy();
    _mapView.destroy();

    // models/collections
    _editions.destroy();
    _siteClasses.destroy();

    // variables
    _accordion = null;
    _analysisCollectionEl = null;
    _analysisCollectionView = null;
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
    _newButton = null;
    _queued = null;
    _serviceType = null;
    _siteClasses = null;

    // methods
    _clearOutput = null;
    _initViewContainer = null;
    _onCalculate = null;
    _onEditionChange = null;
    _onLocationChange = null;
    _onNewButtonClick = null;
    _onRegionChange = null;
    _onTimeHorizonChange = null;
    _onVs30Change = null;
    _setErrorInput = null;
    _setErrorSelect = null;
    _setInputErrors = null;
    _updateRegion = null;
    _updateVs30 = null;
    _validateInputs = null;

    _initialize = null;
    _this = null;
  });

  _this.onCollectionDeselect = function () {
    _this.model.off('change:edition', _onEditionChange);
    _this.model.off('change:errors', _setInputErrors);
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
    _this.model.on('change:errors', _setInputErrors);
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
