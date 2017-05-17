'use strict';


var Accordion = require('accordion/Accordion'),Analysis = require('Analysis'),
    AnalysisCollectionView = require('AnalysisCollectionView'),
    Calculator = require('CurveCalculator'),
    Collection = require('mvc/Collection'),
    CurveOutputView = require('curve/CurveOutputView'),
    DeaggOutputView = require('deagg/DeaggOutputView'),
    InputView = require('input/InputView'),
    LoaderView = require('LoaderView'),
    MapView = require('MapView'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');


var ApplicationView = function (params) {
  var _this,
      _initialize;


  _this = SelectedCollectionView(params);

  _initialize = function (params) {
    _this.initViewContainer();

    _this.dependencyFactory = params.dependencyFactory;

    _this.calculator = Calculator(params.webServices);

    _this.loaderView = LoaderView();

    _this.siteClasses = Collection(_this.dependencyFactory.getAllSiteClasses());
    _this.editions = Collection(_this.dependencyFactory.getAllEditions());

    _this.mapView = MapView({
      collection: _this.collection,
      dependencyFactory: _this.dependencyFactory,
      editions: _this.editions,
      el: _this.mapEl
    });

    // render map before closing the accordion, no need to invalidateSize
    _this.el.querySelector('.accordion-map').classList.add('accordion-closed');

    _this.inputView = InputView({
      collection: _this.collection,
      dependencyFactory: _this.dependencyFactory,
      el: _this.inputEl
    });

    _this.curveOutputView = CurveOutputView({
      collection: _this.collection,
      el: _this.curveOutputEl
    });

    _this.deaggOutputView = DeaggOutputView({
      collection: _this.collection,
      el: _this.deaggOutputEl,
      dependencyFactory: _this.dependencyFactory
    });

    _this.analysisCollectionView = AnalysisCollectionView({
      collection: _this.collection,
      el: _this.analysisCollectionEl
    });

    _this.curveOutputView.on('calculate', 'onCalculate', _this);
    _this.deaggOutputView.on('calculate', 'onCalculate', _this);
  };


  _this.clearOutput = function () {
    _this.model.set({curves: null});
  };

  _this.destroy = Util.compose(_this.destroy, function () {
    _this.calculator.destroy();

    _this.curveOutputView.off('calculate', 'onCalculate', _this);
    _this.deaggOutputView.off('calculate', 'onCalculate', _this);

    _this.newButton.removeEventListener('click', _this.onNewButtonClick);
    _this.computeCurveBtn.removeEventListener('click', _this.queueCalculation,
        _this);

    // sub-views
    _this.accordion.destroy();
    _this.inputView.destroy();
    _this.curveOutputView.destroy();
    _this.deaggOutputView.destroy();
    _this.mapView.destroy();

    // models/collections
    _this.editions.destroy();
    _this.siteClasses.destroy();

    _initialize = null;
    _this = null;
  });

  _this.formatLocationError = function () {
    _this.model.set({
      error: {
        location: '<h3>Please select a location</h3>'
      }
    });
  };

  _this.formatRegionError = function (edition) {
    var i,
        regions,
        regionText;

    regions = _this.dependencyFactory.getAllRegions(edition);

    regionText = '';
    regionText += '<h3>Selected location is outside the allowed bounds' +
        '</h3><ul>';

    for (i = 0; i < regions.length; i++) {
      regionText +=
      '<li>' +
        regions[i].get('display') + ' ' +
        '<ul>' +
          '<span class="min-max">' +
            '<li>' +
              'Latitude [' + regions[i].get('minlatitude') + ', ' +
                  regions[i].get('maxlatitude') + ']' +
            '</li>' +
            '<li>' +
              'Longitude [' + regions[i].get('minlongitude') + ', ' +
                  regions[i].get('maxlongitude') + ']' +
            '</li>' +
          '</span>' +
        '</ul>' +
      '</li>';
    }

    regionText += '</ul>';

    _this.model.set({
      error: {
        location: regionText
      }
    });
  };

  _this.initViewContainer = function () {
    var el;

    el = _this.el;

    el.className = 'application-container';
    el.innerHTML = '';

    _this.mapEl = document.createElement('section');
    _this.inputEl = document.createElement('section');
    _this.curveOutputEl = document.createElement('section');
    _this.deaggOutputEl = document.createElement('section');
    _this.analysisCollectionEl = document.createElement('section');

    // By providing "el" to the Accordion, the sub-view containers are
    // automatically appended to this view's "el".
    _this.accordion = Accordion({
      el: el,
      accordions: [
        {
          classes: 'accordion-map',
          content: _this.mapEl,
          toggleText: 'Earthquake Hazard and Probability Maps'
        },
        {
          classes: 'accordion-input',
          content: _this.inputEl,
          toggleText: 'Input'
        },
        {
          classes: 'accordion-curve',
          content: _this.curveOutputEl,
          toggleText: 'Hazard Curve'
        },
        {
          classes: 'accordion-deagg',
          content: _this.deaggOutputEl,
          toggleText: 'Deaggregation'
        },
        {
          classes: 'analysis-collection-view',
          content: _this.analysisCollectionEl,
          toggleText: 'History'
        }
      ]
    });

    // history button
    _this.newButton = document.createElement('button');
    _this.newButton.className = 'analysis-collection-view-new';
    _this.newButton.innerHTML = 'New';
    _this.newButton.addEventListener('click', _this.onNewButtonClick);

    // append button to history section toggle
    _this.el.querySelector('.analysis-collection-view > .accordion-toggle').
        appendChild(_this.newButton);
  };

  _this.onCalculate = function (data) {
    var calculator,
        request,
        serviceType;

    if (!_this.validateLocation()) {
      return;
    }

    calculator = data.calculator;
    serviceType = data.serviceType;

    if (!_this.queued && calculator) {
      window.setTimeout(function () {
        if (_this.model.get('edition') && _this.model.get('location') &&
            _this.model.get('region') && _this.model.get('vs30')) {
          request = calculator.getResult(
              _this.dependencyFactory.getService(
                  _this.model.get('edition'), serviceType),
              _this.model,
              _this.loaderView.hide
            );
          _this.loaderView.show(request);
        }
        _this.queued = false;
      }, 0);
      _this.queued = true;
    }
  };

  _this.onCollectionDeselect = function () {
    _this.model.off('change:edition', 'onEditionChange', _this);
    _this.model.off('change:location', 'onLocationChange', _this);
    _this.model.off('change:region', 'onRegionChange', _this);
    _this.model.off('change:vs30', 'onVs30Change', _this);
    _this.model.off('change:timeHorizon', 'onTimeHorizonChange', _this);
    _this.model.off('change:curves', 'render', _this);

    _this.model = null;
    _this.render({model: null});
  };


  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();

    _this.model.on('change:edition', 'onEditionChange', _this);
    _this.model.on('change:location', 'onLocationChange', _this);
    _this.model.on('change:region', 'onRegionChange', _this);
    _this.model.on('change:vs30', 'onVs30Change', _this);
    _this.model.on('change:timeHorizon', 'onTimeHorizonChange', _this);
    _this.model.on('change:curves', 'render', _this);

    _this.render({model: _this.model});
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

  _this.onEditionChange = function (/*changes*/) {
    _this.updateVs30();
    _this.updateRegion();
    _this.clearOutput();
  };

  _this.onLocationChange = function (/*changes*/) {
    _this.updateVs30();
    _this.updateRegion();
    _this.clearOutput();
  };

  /**
   * Adds new analysis to the collection and selects the analysis
   */
  _this.onNewButtonClick = function (evt) {
    var analysis;

    analysis = Analysis();
    _this.collection.add(analysis);
    _this.collection.select(analysis);

    evt.cancelBubble = true;
    return evt.preventDefault();
  };

  _this.onRegionChange = function (/*changes*/) {
    _this.clearOutput();
  };

  _this.onTimeHorizonChange = function (/*changes*/) {
  };

  _this.onVs30Change = function (/*changes*/) {
    _this.updateRegion();
    _this.clearOutput();
  };

  _this.queueCalculation = function () {
    var request;
    if (!_this.queued) {
      window.setTimeout(function () {
        if (_this.model.get('edition') && _this.model.get('location') &&
            _this.model.get('region') && _this.model.get('vs30')) {
          request = _this.calculator.getResult(
              _this.dependencyFactory.getService(_this.model.get('edition')),
              _this.model,
              _this.loaderView.hide
            );
          _this.loaderView.show(request);
        }
        _this.queued = false;
      }, 0);
      _this.queued = true;
    }
  };

  _this.render = function (/*changes*/) {
  };

  /**
   * Sets the region for the current model based on the currently selected
   * edition, location, and vs30.
   *
   */
  _this.updateRegion = function () {
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

    edition = _this.dependencyFactory.getEdition(_this.model.get('edition'));
    location = _this.model.get('location');

    if (edition && location) {
      regions = _this.dependencyFactory.getRegions(
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

  /**
   * Resets the collection of siteClasses based on what is available for
   * current selection of edition/location.
   */
  _this.updateVs30 = function () {
    var edition,
        ids,
        location,
        regions,
        siteClasses;

    ids = {};

    try {
      edition = _this.dependencyFactory.getEdition(_this.model.get('edition'));
      location = _this.model.get('location');
      regions = _this.dependencyFactory.getRegions(
          edition.get('supports').region, edition.id);

      regions.forEach(function (region) {
        if (region.contains(location)) {
          region.get('supports').vs30.forEach(function (vs30) {
            ids[vs30] = true;
          });
        }
      });

      siteClasses = _this.dependencyFactory.getSiteClasses(Object.keys(ids),
          _this.model.get('edition'));
    } catch (e) {
      // Just ignore, will set to use all site classes below
    }

    if (!siteClasses) {
      siteClasses = _this.dependencyFactory.getAllSiteClasses(
          _this.model.get('edition'));
    }

    _this.siteClasses.reset(siteClasses, {silent: true});
    _this.siteClasses.trigger('reset', {});
  };

  _this.validateLocation = function () {
    var checkLocation,
        edition,
        location;

    location = _this.model.get('location');

    if (location === null) {
      _this.formatLocationError();
      return false;
    }

    edition = _this.model.get('edition');

    checkLocation =
        _this.dependencyFactory.getRegionByEdition(edition, location);

    if (checkLocation === null) {
      _this.formatRegionError(edition);
      return false;
    }

    _this.model.set({
      error: null
    });

    return true;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ApplicationView;
