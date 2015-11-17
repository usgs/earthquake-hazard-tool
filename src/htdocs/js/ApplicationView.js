'use strict';

var ActionsView = require('ActionsView'),
    BasicInputsView = require('BasicInputsView'),

    Calculator = require('CurveCalculator'),
    // ComponentCurvesGraphView = require('ComponentCurvesGraphView'),
    CurveOutputView = require('curve/CurveOutputView'),
    DeaggOutputView = require('deagg/DeaggOutputView'),
    ErrorsView = require('ErrorsView'),
    // HazardCurveView = require('HazardCurveGraphView'),
    // HazardSpectrumView = require('ResponseSpectrumGraphView'),
    LoaderView = require('LoaderView'),
    MapView = require('MapView'),

    Collection = require('mvc/Collection'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');


var ApplicationView = function (params) {
  var _this,
      _initialize,

      // variables
      _actionsEl,
      _actionsView,
      _basicInputsEl,
      _basicInputsView,
      _calculator,
      // _componentCurveEl,
      // _componentCurveView,
      _computeCurveBtn,
      // _curves,
      _curveOutput,
      _curveOutputEl,
      _curveOutputView,
      _deaggOutputEl,
      _deaggOutputView,
      _dependencyFactory,
      _editions,
      _errorsEl,
      _errorsView,
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
      // _onCurveDeselect,
      // _onCurveSelect,
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

    // _curves = Collection();
    // _curves.on('select', _onCurveSelect);
    // _curves.on('deselect', _onCurveDeselect);

    _errorsView = ErrorsView({
      collection: _this.collection,
      el: _errorsEl,
    });

    _basicInputsView = BasicInputsView({
      collection: _this.collection,
      editions: _editions,
      el: _basicInputsEl,
      siteClasses: _siteClasses,
      errorsView: _errorsView
    });

    _mapView = MapView({
      collection: _this.collection,
      dependencyFactory: _dependencyFactory,
      editions: _editions,
      el: _mapEl
    });

    _actionsView = ActionsView({
      collection: _this.collection,
      el: _actionsEl,
      errorsView: _errorsView,
      application: _this
    });

    // _hazardCurveView = HazardCurveView({
    //   curves: _curves,
    //   el: _hazardCurveEl.appendChild(document.createElement('div')),
    //   title: 'Hazard Curves'
    // });

    // _hazardSpectrumView = HazardSpectrumView({
    //   curves: _curves,
    //   el: _hazardSpectrumEl.appendChild(document.createElement('div')),
    //   title: 'Hazard Response Spectrum'
    // });

    // _componentCurveView = ComponentCurvesGraphView({
    //   collection: _curves,
    //   el: _componentCurveEl.appendChild(document.createElement('div')),
    //   title: 'Hazard Curve Compoents'
    // });
    _curveOutputView = CurveOutputView({
      collection: _this.collection,
      el: _curveOutputEl
    });

    _deaggOutputView = DeaggOutputView({
      collection: _this.collection,
      el: _deaggOutputEl
    });
  };


  _clearOutput = function () {
    _this.model.set({curves: null});
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
      '<div class="application-errors"></div>',
      '<div class="application-actions"></div>',
      '<h2>Hazard Curve</h2>',
      '<div class="row curve-output-view"></div>',
      // '<div class="row curve-output">',
      //   '<div class="curve-output-mask">',
      //     '<p class="alert info">',
      //       'Please select &ldquo;Edition&rdquo;, &ldquo;Location&rdquo; ',
      //       '&amp; &ldquo;Site Class&rdquo; above to compute a hazard curve.',
      //       '<br/><button class="curve-output-calculate">',
      //         'Compute Hazard Curve',
      //       '</button>',
      //     '</p>',
      //   '</div>',
      //   '<section class="application-hazard-curve column one-of-two">',
      //   '</section>',
      //   '<section class="application-hazard-spectrum column one-of-two">',
      //   '</section>',
      //   '<section class="application-hazard-component column one-of-two">',
      //   '</section>',
      // '</div>',
      '<h2>Deaggregation</h2>',
      '<div class="row deagg-output-view"></div>'
    ].join('');

    _basicInputsEl = el.querySelector('.application-basic-inputs');
    _mapEl = el.querySelector('.application-map');
    _errorsEl = el.querySelector('.application-errors');
    _actionsEl = el.querySelector('.application-actions');
    // _computeCurveBtn = el.querySelector('.curve-output-calculate');
    // _componentCurveEl = el.querySelector('.application-hazard-component');
    // _curveOutput = el.querySelector('.curve-output');
    // _hazardCurveEl = el.querySelector('.application-hazard-curve');
    // _hazardSpectrumEl = el.querySelector('.application-hazard-spectrum');
    _curveOutputEl = el.querySelector('.curve-output-view');
    _deaggOutputEl = el.querySelector('.deagg-output-view');

    // _computeCurveBtn.addEventListener('click', _this.queueCalculation, _this);
  };

  // /**
  //  * Called when a curve for the current model is deselected.
  //  *
  //  * Clears the "imt" and "period" values on the current model.
  //  */
  // _onCurveDeselect = function () {
  //   if (_this.model) {
  //     _this.model.set({
  //       imt: null,
  //       period: null
  //     });
  //   }
  // };

  // *
  //  * Called whena curve for the current model is selected.
  //  *
  //  * Updates the "imt" and "period" values on the current model.

  // _onCurveSelect = function () {
  //   var selected;
  //   if (_this.model) {
  //     selected = _curves.getSelected();
  //     _this.model.set({
  //       imt: selected.get('imt'),
  //       period: selected.get('period')
  //     });
  //   }
  // };

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
    var timeHorizon;

    if (_this.model) {
      timeHorizon = _this.model.get('timeHorizon');

      _hazardCurveView.model.set({
        'timeHorizon': timeHorizon
      });
      _hazardSpectrumView.model.set({
        'timeHorizon': timeHorizon
      });
    }
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

    console.log(_this.model.get());
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _calculator.destroy();

    _computeCurveBtn.removeEventListener('click', _this.queueCalculation,
        _this);

    // sub-views
    _actionsView.destroy();
    _basicInputsView.destroy();
    _curveOutputView.destroy();
    _deaggOutputView.destroy();
    // _hazardCurveView.destroy();
    // _hazardSpectrumView.destroy();
    _mapView.destroy();

    // models/collections
    _editions.destroy();
    _siteClasses.destroy();

    // _curves.off('select', _onCurveSelect);
    // _curves.off('deselect', _onCurveDeselect);
    // _curves.destroy();

    // variables
    _actionsEl = null;
    _actionsView = null;
    _basicInputsEl = null;
    _basicInputsView = null;
    _calculator = null;
    _computeCurveBtn = null;
    _curveOutput = null;
    _deaggOutputEl = null;
    _deaggOutputView = null;
    _dependencyFactory = null;
    _editions = null;
    _errorsEl = null;
    _errorsView = null;
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
    // _onCurveDeselect = null;
    // _onCurveSelect = null;
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
    // var curves,
    //     data,
    //     id,
    //     imt,
    //     timeHorizon,
    //     xAxisLabel,
    //     yAxisLabel;

    // // default labels, data, time horizon
    // xAxisLabel = 'Ground Motion (g)';
    // yAxisLabel = 'Annual Frequency of Exceedence';
    // data = [];
    // timeHorizon = 2475;
    // id = null;


    // if (_this.model && changes) {
    //   _updateVs30();
    //   _updateRegion();

    //   curves = _this.model.get('curves');
    //   if (curves) {
    //     xAxisLabel = curves.get('xlabel');
    //     yAxisLabel = curves.get('ylabel');
    //     data = curves.get('curves').data();
    //   }
    //   timeHorizon = _this.model.get('timeHorizon');

    //   // find model period, to select curve within collection
    //   imt = _this.model.get('imt');
    //   data.every(function (curve) {
    //     if (curve.get('imt') === imt) {
    //       id = curve.get('id');
    //       return false;
    //     }
    //     return true;
    //   });
    // }

    // // Update curve plotting
    // try {
    //   _hazardCurveView.model.set({
    //     'xLabel': xAxisLabel,
    //     'yLabel': yAxisLabel,
    //     'timeHorizon': timeHorizon
    //   }, {silent: true});
    // } catch (e) {
    //   if (console && console.error) {
    //     console.error(e);
    //   }
    // }

    // // Update spectra plotting
    // try {
    //   _hazardSpectrumView.model.set({
    //     'timeHorizon': timeHorizon
    //   }, {silent: true});
    // } catch (e) {
    //   if (console && console.error) {
    //     console.error(e);
    //   }
    // }

    // _curves.reset(data);

    // if (data.length === 0) {
    //   // No curve data
    //   _curveOutput.classList.remove('curve-output-ready');
    // } else {
    //   _curveOutput.classList.add('curve-output-ready');
    // }

    // if (id !== null) {
    //   _curves.selectById(id);
    // }
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ApplicationView;
