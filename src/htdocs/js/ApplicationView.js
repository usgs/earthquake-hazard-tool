'use strict';

var ActionsView = require('ActionsView'),
    BasicInputsView = require('BasicInputsView'),
    Calculator = require('Calculator'),
    HazardCurveView = require('HazardCurveGraphView'),
    HazardSpectrumView = require('ResponseSpectrumGraphView'),
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
      _dependencyFactory,
      _editions,
      _hazardCurveEl,
      _hazardCurveView,
      _hazardSpectrumEl,
      _hazardSpectrumView,
      _mapEl,
      _mapView,
      _siteClasses,

      // methods
      _initViewContainer,
      _onEditionLocationChange,
      _onRegionChange,
      _onTimeHorizonChange,
      _onVs30Change;


  _this = SelectedCollectionView(params);

  _initialize = function (params) {
    _initViewContainer();

    _dependencyFactory = params.dependencyFactory;

    _calculator = Calculator();

    _siteClasses = Collection(_dependencyFactory.getAllSiteClasses());
    _editions = Collection(_dependencyFactory.getAllEditions());


    _basicInputsView = BasicInputsView({
      collection: _this.collection,
      editions: _editions,
      el: _basicInputsEl,
      siteClasses: _siteClasses
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
    });

    _hazardCurveView = HazardCurveView({
      el: _hazardCurveEl,
      title: 'Hazard Curves'
    });

    _hazardSpectrumView = HazardSpectrumView({
      el: _hazardSpectrumEl,
      title: 'Hazard Response Spectrum'
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
      '<div class="application-actions"></div>',
      '<div class="row">',
        '<section class="application-hazard-curve column one-of-two">',
        '</section>',
        '<section class="application-hazard-spectrum column one-of-two">',
        '</section>',
      '</div>'
    ].join('');

    _basicInputsEl = el.querySelector('.application-basic-inputs');
    _mapEl = el.querySelector('.application-map');
    _actionsEl = el.querySelector('.application-actions');
    _hazardCurveEl = el.querySelector('.application-hazard-curve');
    _hazardSpectrumEl = el.querySelector('.application-hazard-spectrum');
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

  /**
   * Find all regions supported by the current edition that also contain the
   * current location. Create a unique list of available vs30 values and
   * reset the vs30 collection with them.
   *
   */
  _onEditionLocationChange = function (/*changes*/) {
    var edition,
        ids,
        location,
        regions,
        siteClasses;

    ids = {};

    try {
      edition = _dependencyFactory.getEdition(_this.model.get('edition'));
      location = _this.model.get('location');
      regions = _dependencyFactory.getRegions(edition.get('supports').region);

      regions.forEach(function (region) {
        if (region.contains(location)) {
          region.get('supports').vs30.forEach(function (vs30) {
            ids[vs30] = true;
          });
        }
      });

      siteClasses = _dependencyFactory.getSiteClasses(Object.keys(ids));
    } catch (e) {
      // Just ignore, will set to use all site classes below
    }

    if (!siteClasses) {
      siteClasses = _dependencyFactory.getAllSiteClasses();
    }

    _siteClasses.reset(siteClasses);
  };

  /**
   *
   */
  _onRegionChange = function (/*changes*/) {
    if (_this.model.get('edition') && _this.model.get('location') &&
        _this.model.get('region') && _this.model.get('vs30')) {
      _calculator.getResult('staticcurve', _this.model);
    }
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
   *
   */
  _onVs30Change = function (/*changes*/) {
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
    regions = _dependencyFactory.getRegions(edition.get('supports').region);

    regions.some(function (region) {
      var supports = region.get('supports').vs30;

      if (region.contains(location) && supports.indexOf(vs30) !== -1) {
        // region contains location and supports the current vs30, select it
        _this.model.set({region: region.get('id')});
        return true; // break, essentially
      }
    });
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _calculator.destroy();

    // sub-views
    _actionsView.destroy();
    _basicInputsView.destroy();
    _hazardCurveView.destroy();
    _hazardSpectrumView.destroy();
    _mapView.destroy();

    // models/collections
    _editions.destroy();
    _siteClasses.destroy();

    // variables
    _actionsEl = null;
    _actionsView = null;
    _basicInputsEl = null;
    _basicInputsView = null;
    _calculator = null;
    _dependencyFactory = null;
    _editions = null;
    _hazardCurveEl = null;
    _hazardCurveView = null;
    _hazardSpectrumEl = null;
    _hazardSpectrumView = null;
    _mapEl = null;
    _mapView = null;
    _siteClasses = null;

    // methods
    _initViewContainer = null;
    _onEditionLocationChange = null;
    _onRegionChange = null;
    _onTimeHorizonChange = null;
    _onVs30Change = null;

    _initialize = null;
    _this = null;
  });

  _this.onCollectionDeselect = function () {
    _this.model.off('change:edition', _onEditionLocationChange);
    _this.model.off('change:location', _onEditionLocationChange);
    _this.model.off('change:region', _onRegionChange);
    _this.model.off('change:vs30', _onVs30Change);
    _this.model.off('change:timeHorizon', _onTimeHorizonChange);
    _this.model.off('change:curves', 'render', _this);

    _this.model = null;
    _this.render({model: null});
  };

  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();

    _this.model.on('change:edition', _onEditionLocationChange);
    _this.model.on('change:location', _onEditionLocationChange);
    _this.model.on('change:region', _onRegionChange);
    _this.model.on('change:vs30', _onVs30Change);
    _this.model.on('change:timeHorizon', _onTimeHorizonChange);
    _this.model.on('change:curves', 'render', _this);

    _this.render({model: _this.model});
  };

  _this.render = function (changes) {
    var curves,
        data,
        xAxisLabel,
        yAxisLabel;

    if (_this.model && changes) {
      curves = _this.model.get('curves');

      xAxisLabel = '';
      yAxisLabel = '';
      data = [];

      if (curves) {
        xAxisLabel = curves.get('xlabel');
        yAxisLabel = curves.get('ylabel');

        data = curves.get('curves').data();
      }

      // Update curve plotting
      _hazardCurveView.model.set({
        'xLabel': xAxisLabel,
        'yLabel': yAxisLabel,
        'timeHorizon': _this.model.get('timeHorizon')
      }, {silent: true});
      _hazardCurveView.curves.reset(data);

      // Update spectra plotting
      _hazardSpectrumView.model.set({
        'xAxisLabel': xAxisLabel,
        'yAxisLabel': yAxisLabel,
        'timeHorizon': _this.model.get('timeHorizon')
      }, {silent: true});
      _hazardSpectrumView.curves.reset(data);
    }
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ApplicationView;
