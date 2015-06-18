'use strict';

var Meta = require('Meta'),
    Region = require('Region'),

    Collection = require('mvc/Collection'),

    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _DEFAULTS = {
  url: 'metadata.json'
};

var _INSTANCE = null;

var DependencyFacotry = function (params) {
  var _this,
      _initialize,

      _callbacks,
      _contourTypes,
      _data,
      _editions,
      _inRegion,
      _isReady,
      _regions,
      _siteClasses,
      _spectralPeriods,
      _timeHorizons,
      _url,

      _buildCollection,
      _getSupported,
      _onSuccess,
      _onError;

  _this = {
    getEdition: null,
    getEditions: null,
    getAllEditions: null,
    getSiteClass: null,
    getSiteClasses: null,
    getAllSiteClasses: null,
    getFilteredSiteClasses: null,
    getSpectralPeriod: null,
    getSpectralPeriods: null,
    getAllSpectralPeriods: null,
    getFilteredSpectralPeriods: null,
    getTimeHorizon: null,
    getTimeHorizons: null,
    getAllTimeHorizons: null,
    getFilteredTimeHorizons: null,
    getContourType: null,
    getContourTypes: null,
    getAllContourTypes: null,
    getFilteredContourTypes: null,
    getInstance: null
  };

  _initialize = function (params) {
    params = Util.extend({}, _DEFAULTS, params);

    _url = params.url;
    _editions = Collection([]);
    _contourTypes = Collection([]);
    _regions = Collection([]);
    _siteClasses = Collection([]);
    _spectralPeriods = Collection([]);
    _timeHorizons = Collection([]);

    _callbacks = [];
    _isReady = false;

    Xhr.ajax({
      url: _url,
      success: _onSuccess,
      error: _onError
    });
  };

  /**
   * Sets the dependency collections with the default values
   * returned by the Xhr request.
   *
   * @param  data {Object}
   *         Data returned from the Xhr request.
   */
  _onSuccess = function (data/*, xhr*/) {

    _data = data;
    _editions.reset(_data.parameters.edition.values.map(Meta));
    _regions.reset(_data.parameters.region.values.map(Region));
    _contourTypes.reset(_data.parameters.contourType.values.map(Meta));
    _siteClasses.reset(_data.parameters.vs30.values.map(Meta));
    _spectralPeriods.reset(_data.parameters.imt.values.map(Meta));
    _timeHorizons.reset(_data.parameters.timeHorizon.values.map(Meta));

    _isReady = true;

    _callbacks.forEach(function (callback) {
      try {
        callback();
      } catch (e) {
        if (console && console.log) {
          console.log(e);
        }
      }
    });
  };

  /** 
   * Error callback for the Xhr request
   */
  _onError = function (/*status, xhr*/) {
    throw new Error('Error retreiving dependancy data.');
  };

  /**
   * Determines if the location (lat/lon) is in the provided region
   *
   * @param  region {Object}
   *         [description]
   *
   * @param  latitude {Number}
   *         [description]
   *
   * @param  longitude {Number}
   *         [description]
   *
   * @return {boolean},
   *         Whether the point is in the region.
   */
  _inRegion = function (region, latitude, longitude) {
    var minlatitude,
        minlongitude,
        maxlatitude,
        maxlongitude;

    minlatitude = region.get('minlatitude');
    minlongitude = region.get('minlongitude');
    maxlatitude = region.get('maxlatitude');
    maxlongitude = region.get('maxlongitude');

    if (latitude > minlatitude && latitude < maxlatitude &&
        longitude > minlongitude && longitude < maxlongitude) {
      return true;
    }

    return false;
  };

  /**
   * Filter a collection based on an array of ids
   *
   * @param  collection {Collection}
   *         The collection to be filtered.
   *
   * @param  ids {Array}
   *         The ids to look for in the collection.
   *         
   * @return {Collection}
   *         The filtered collection.
   */
  _getSupported = function (collection, ids) {
    return collection.data().filter(function (model) {
      if (ids.indexOf(model.get('id')) !== -1) {
        return true;
      }
    });
  };

  /**
   * Clean up variables and methods
   */
  _this.destroy = function () {
    _buildCollection = null;
    _getSupported = null;
    _onError = null;
    _onSuccess = null;

    _callbacks = null;
    _contourTypes = null;
    _data = null;
    _editions = null;
    _isReady = null;
    _inRegion = null;
    _regions = null;
    _siteClasses = null;
    _spectralPeriods = null;
    _timeHorizons = null;
    _url = null;

    _this = null;
    _initialize = null;
  };

  /**
   * Get all Countour Types
   *
   * @return {Collection} Collection of Contour Type models.
   */
  _this.getContourType = function(id) {
    return _contourTypes.get(id);
  };

  _this.getContourTypes = function (ids) {
    return _getSupported(_contourTypes, ids);
  };

  _this.getAllContourTypes = function () {
    return _contourTypes;
  };

  /**
   * Get all Editions
   *
   * @return {Collection} Collection of Edition models.
   */
  _this.getEdition = function(id) {
    return _editions.get(id);
  };

  _this.getEditions = function (ids) {
    return _getSupported(_editions, ids);
  };

  _this.getAllEditions = function () {
    return _editions;
  };

  /** 
   * Get all Regions
   *
   * @return {Collection} Collection of Site Class models.
   */
  _this.getRegion = function (id) {
    return _regions.get(id);
  };

  _this.getRegions = function (ids) {
    return _getSupported(_regions, ids);
  };

  _this.getAllRegions = function () {
    return _regions;
  };

  /**
   * Get all Site Classes
   *
   * @return {Collection} Collection of Site Class models.
   */
  _this.getSiteClass = function (id) {
    return _siteClasses.get(id);
  };

  _this.getSiteClasses = function (ids) {
    return _getSupported(_siteClasses, ids);
  };

  _this.getAllSiteClasses = function () {
    return _siteClasses;
  };


  /**
   * Get all Spectral Periods.
   *
   * @return {Collection} Collection of Spectral Period models.
   */
  _this.getSpectralPeriod = function (id) {
    return _spectralPeriods.get(id);
  };

  _this.getSpectralPeriods = function (ids) {
    return _getSupported(_spectralPeriods, ids);
  };

  _this.getAllSpectralPeriods = function () {
    return _spectralPeriods;
  };


  /**
   * Get all Time Horizons.
   *
   * @return {Collection} Collection of Time Horizon models.
   */
  _this.getTimeHorizon = function (id) {
    return _timeHorizons.get(id);
  };

  _this.getTimeHorizons = function (ids) {
    return _getSupported(_timeHorizons, ids);
  };

  _this.getAllTimeHorizons = function () {
    return _timeHorizons;
  };

  /**
   * Get all Contour Types for the provided Edition
   *
   * @param  editionId {Integer}
   *         Edition model.id
   *
   * @return {Collection} Collection of Contour Type models.
   */
  _this.getFilteredContourTypes = function (editionId) {
    var edition,
        ids;

    // get supported countour types
    edition = _this.getEdition(editionId);
    ids = edition.get('supports').contourType;

    return _this.getContourTypes(ids);
  };

  /**
   * Get all Site Classes that are supported for the selected edition/location
   *
   * @param  editionId {Integer}
   *         Edition model.id
   *
   * @param  latitude {Number}
   *         The latitude of the selected location
   *
   * @param  longitude {Number}
   *         The longitude of the selected location
   *
   * @return {Collection} Collection of Site Class models.
   */
  _this.getFilteredSiteClasses = function (editionId, latitude, longitude) {
    var edition,
        regions,
        ids = [];

    // get edtion
    edition = _this.getEdition(editionId);

    // find supported regions
    regions = _this.getRegions(edition.get('supports').region);

    // check that latitude/longitude is valid for region
    regions.forEach(function (region) {
      // add to siteClassId array for each vaid region
      if (_inRegion(region, latitude, longitude)) {
        ids = ids.concat(region.get('supports').vs30);
      }
    });

    // return all supported site classes
    return _this.getSiteClasses(ids);
  };


  /**
   * Get all Spectral Periods for the provided Edition
   *
   * @param  editionId {Integer}
   *         Edition model.id
   *
   * @param  latitude {Number}
   *         The latitude of the selected location
   *
   * @param  longitude {Number}
   *         The longitude of the selected location
   *
   * @return {Collection} Collection of Spectral Period models.
   */
  _this.getFilteredSpectralPeriods = function (editionId, latitude, longitude) {
    var edition,
        regions,
        ids = [];

    // get edition
    edition = _this.getEdition(editionId);

    // find supported regions
    regions = _this.getRegions(edition.get('supports').region);

    // check that latitude/longitude is valid for region
    regions.forEach(function (region) {
      // get spectral period ids
      if (_inRegion(region, latitude, longitude)) {
        ids = ids.concat(region.get('supports').imt);
      }
    });

    return _this.getSpectralPeriods(ids);
  };

  /**
   * Get all Time Horizons for the provided Edition
   *
   * @param  editionId {Integer}
   *         Edition model.id
   *
   * @return {Collection} Collection of Time Horizon models.
   */
  _this.getFilteredTimeHorizons = function (editionId) {
    var edition,
        ids;

    // get spectral period ids, for the provided edition
    edition = _this.getEdition(editionId);
    ids = edition.get('supports').timeHorizon;

    return _this.getTimeHorizons(ids);
  };


  /**
   * Build an array of callbacks to be executed when the
   * Xhr request is returned.
   *
   * @param  callback {Function}
   *         a callback to be called by the Xhr success callback
   */
  _this.whenReady = function (callback) {
    if (_isReady) {
      callback();
    } else {
      _callbacks.push(callback);
    }
  };

  _initialize(params);
  params = null;
  return _this;

};

/**
 * Creates an instance of the DependencyFactory
 */
var _createInstance = function (params) {
  _INSTANCE = DependencyFacotry(params);
};

/**
 * Return the existing instance, or if none exists create
 * a new instance.
 *
 * @return {Object} DependencyFactory instance
 */
var _getInstance = function (params) {
  // check if an instance exists
  if (!_INSTANCE) {
    _createInstance(params);
  }

  // return an instance of the Dependancy Factory
  return _INSTANCE;
};

module.exports = {
  'getInstance': _getInstance
};
