'use strict';

var DependencyFactory = require('DependencyFactory'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');

/**
 * Displays a collection of spectral periods in a collection select box,
 * The collection of spectral periods updates when the selected analysis
 * in the collection of analyses changes.
 *
 * SpectralPeriodView({
 *   el: document.createElement('div'),
 *   editions: Collection([SpectralPeriods]),
 *   collection: Collection([Analysis])
 * });
 *
 * @param {[type]} params [description]
 */
var SpectralPeriodView = function (params) {

  var _this,
      _initialize,

      _dependencyFactory,
      _selectSpectralPeriod,
      _spectralPeriodCollection,
      _spectralPeriodCollectionSelectBox,

      _updateSpectralPeriods,
      _updateSpectralPeriodsCollectionSelectBox;

  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function (params) {

    // spectral periods CollectionSelectBox
    _spectralPeriodCollection = params.imt || Collection();
    _dependencyFactory = params.dependencyFactory || DependencyFactory.getInstance();

    _spectralPeriodCollectionSelectBox = CollectionSelectBox({
      collection: _spectralPeriodCollection,
      el: _this.el,
      includeBlankOption: true,
      format: function (model) {
        return model.get('display');
      }
    });

    // bind to select on the Site Class collection
    _spectralPeriodCollection.on('select', _updateSpectralPeriods);
    _spectralPeriodCollection.on('deselect', _updateSpectralPeriods);

    // update/select the spectral period in the currently selected Analysis
    _dependencyFactory.whenReady(function () {
      _this.render();
    });
  };

  /**
   * update the currently selected Analysis model with
   * the currently selected Site Class in the CollectionSelectBox.
   */
  _updateSpectralPeriods = function () {
    var existingSpectralPeriods,
        newSpectralPeriods;

    newSpectralPeriods = _spectralPeriodCollection.getSelected();

    if (_this.model) {
      existingSpectralPeriods = _this.model.get('imt');
    }

    if (existingSpectralPeriods && newSpectralPeriods &&
        existingSpectralPeriods.get('id') !== newSpectralPeriods.get('id')) {
      _this.model.set(
        {'imt': _spectralPeriodCollection.getSelected()}
      );
    }
  };

  /**
   * Update the spectral period options in the select box based on
   * the location and edition.
   */
  _updateSpectralPeriodsCollectionSelectBox = function () {
    var edition,
        latitude,
        longitude,
        spectralPeriods = [];

    if (_this.model) {
      edition = _this.model.get('edition');
      latitude = _this.model.get('latitude');
      longitude = _this.model.get('longitude');

      // check on requisite params for filtering
      if (edition && latitude && longitude) {
        spectralPeriods = _dependencyFactory.getFilteredSpectralPeriodses(
            edition.get('id'), latitude, longitude);
        _spectralPeriodCollection.reset(spectralPeriods);
      }
    }
  };

  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {
    // unbind
    _spectralPeriodCollection.off('select', _updateSpectralPeriods);
    _spectralPeriodCollection.off('deselect', _updateSpectralPeriods);
    // methods
    _updateSpectralPeriods = null;
    // variables
    _selectSpectralPeriod = null;
    _spectralPeriodCollection = null;
    _spectralPeriodCollectionSelectBox = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);

  /**
   * unset the event bindings for the collection
   */
  _this.onCollectionDeselect = function () {
    _this.model.off('change', _updateSpectralPeriodsCollectionSelectBox);
    _this.model = null;
    _this.render();
  };

  /**
   * set event bindings for the collection
   */
  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();
    _this.model.on('change', _updateSpectralPeriodsCollectionSelectBox);
    _this.render();
  };

  /**
   * render the selected spectral period, or the blank option
   */
  _this.render = function () {
    var spectralPeriod;

    // update the spectral period collection before selecting
    _updateSpectralPeriodsCollectionSelectBox();

    // Update selected spectral period when collection changes
    if (_this.model) {
      spectralPeriod = _this.model.get('imt');
      if (spectralPeriod === null) {
        _spectralPeriodCollection.deselect();
      } else {
        _spectralPeriodCollection.selectById(spectralPeriod.id);
      }
    } else {
      // no item in the collection has been selected
      _spectralPeriodCollection.deselect();
    }
  };

  _initialize(params);
  params = null;
  return _this;

};

module.exports = SpectralPeriodView;
