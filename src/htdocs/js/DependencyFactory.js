'use strict';

var Meta = require('Meta'),
    Region = require('Region'),

    Collection = require('mvc/Collection'),

    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _DEFAULTS = {
  //url: 'curve.ws.php'
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
      _url,

      _buildCollection,
      _onSuccess,
      _onError;

  _this = {
    getEditions: null,
    getSiteClasses: null,
    getSupportedSiteClasses: null,
    getSpectralPeriods: null,
    getTimeHorizons: null,
    getCountourTypes: null,
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

    _callbacks = [];

    _isReady = false;

    Xhr.ajax({
      url: _url,
      success: _onSuccess,
      error: _onError
    });
  };

  _onSuccess = function (data/*, xhr*/) {

    _data = data;

    _editions.reset(_data.parameters.edition.values.map(Meta));
    _regions.reset(_data.parameters.region.values.map(Region));
    _contourTypes.reset(_data.parameters.imt.values.map(Meta));
    _siteClasses.reset(_data.parameters.vs30.values.map(Meta));
    _spectralPeriods.reset(_data.parameters.imt.values.map(Meta));

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

  _onError = function (/*status, xhr*/) {
    throw new Error('Error retreiving dependancy data.');
  };

  // Determines if the location (lat/lon) is in the provided region
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


  _this.destroy = function () {
    _buildCollection = null;
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
    _url = null;

    _this = null;
    _initialize = null;
  };

  /**
   * Get all Countour Types, based on the provided Edition.
   * If no parameters are specified return all Countour Types.
   *
   * @param  editionId {Integer}
   *         Edition model.id
   *
   * @return {Collection} Collection of Contour Type models.
   */
  _this.getContourTypes = function (editionId) {

    // get all Contour Types
    if (editionId) {
      // TODO, update contour typee based on selected editionId
    } else {
      return _contourTypes;
    }
  };

  /**
   * Get all editions.
   *
   * @return {Collection} Collection of Edition models.
   */
  _this.getEditions = function () {
    // get all Editions 
    return _editions;
  };

  _this.getEdition = function(id) {
    return _editions.get(id);
  };


  _this.getRegions = function () {
    return _regions;
  };

  _this.getRegion = function (id) {
    return _regions.get(id);
  };

  /**
   * Get all Site Classes.
   * If no parameters are specified return 'B/C Boundary'
   *
   * @return {Collection} Collection of Site Class models.
   */
  _this.getSiteClasses = function () {
    // get all Site Classes
    return _siteClasses;
  };

  _this.getSiteClass = function (id) {
    return _siteClasses.get(id);
  };

  /**
   * Get site classes that are supported for the selected edition/location
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
  _this.getSupportedSiteClasses = function (editionId, latitude, longitude) {
    var edition,
        regionIds = [],
        regions,
        siteClassIds = [];

    // get edtion
    edition = _this.getEdition(editionId);

    // find supported regions
    regionIds = edition.get('supports').region;
    regions = regionIds.map(_this.getRegion);

    // check that latitude/longitude is valid for region
    regions.forEach(function (region) {
      if (_inRegion(region, latitude, longitude)) {
        // add to siteClassId array for each vaid region
        siteClassIds = siteClassIds.concat(region.get('supports').vs30);
      }
    });

    // return all supported site classes
    return siteClassIds.map(_this.getSiteClass);
  };



  /**
   * Get all Spectral Periods, based on the provided Edition.
   * If no parameters are specified return all Spectral Periods.
   *
   * @param  editionId {Integer}
   *         Edition model.id
   *
   * @return {Collection} Collection of Spectral Period models.
   */
  _this.getSpectralPeriods = function (editionId) {
    // get all Spectral Periods
    if (editionId) {
      // TODO, update url and search based on editionId
      return;
    } else {
      return _spectralPeriods;
    }
  };

  // /**
  //  * Get all Time Horizons, based on the provided Edition.
  //  * If no parameters are specified return all Time Horizons.
  //  *
  //  * @param  editionId {Integer}
  //  *         Edition model.id
  //  *
  //  * @return {Collection} Collection of Time Horizon models.
  //  */
  // _this.getTimeHorizons = function (editionId) {
  //   // TODO, get all Time Horizons
  //   return Collection([Meta()]);
  // };

  /**
   * [whenReady description]
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
