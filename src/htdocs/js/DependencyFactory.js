'use strict';


var Collection = require('mvc/Collection'),
    Meta = require('Meta'),
    Region = require('Region'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _TYPE_CURVE = 'curve',
    _TYPE_DEAGG = 'deaggregation';

var _DEFAULTS = {
  services: {
    'curve': {
      'staticcurve': {
        metaUrl: 'curve/metadata.json',
        urlStub: null,
        params: null,
        constructor: 'HazardResponse'
      }
    },
    'deaggregation': {
      'dynamicdeagg': {
        metaUrl: 'deagg/metadata.json',
        urlStub: null,
        params: null,
        constructor: 'deagg/DeaggResponse'
      }
    }
  }
};

var _INSTANCE = null;

var DependencyFactory = function (params) {
  var _this,
      _initialize;


  _this = {
    getEdition: null,
    getEditions: null,
    getAllEditions: null,
    getSiteClass: null,
    getSiteClasses: null,
    getAllSiteClasses: null,
    getSpectralPeriod: null,
    getSpectralPeriods: null,
    getAllSpectralPeriods: null,
    getFilteredSpectralPeriods: null,
    getContourType: null,
    getContourTypes: null,
    getAllContourTypes: null,
    getFilteredContourTypes: null,
    getInstance: null
  };

  _initialize = function (params) {
    var serviceName,
        serviceType,
        services;

    params = Util.extend({}, _DEFAULTS, params);

    _this.data = {};

    _this.services = params.services;
    _this.pendingRequests = {};

    _this.callbacks = [];
    _this.isReady = false;

    for (serviceType in _this.services) {
      services = _this.services[serviceType];

      for (serviceName in services) {
          _this.fetchService(serviceName, serviceType);
      }
    }
  };

  /**
   * Clean up variables and methods
   */
  _this.destroy = function () {
    _this = null;
    _initialize = null;

    _INSTANCE = null;
  };

  _this.fetchService = function (serviceName, serviceType) {
    var service,
        url;

    service = _this.getServiceByName(serviceName, serviceType);

    if (service) {
      url = service.metaUrl;

      _this.pendingRequests[serviceName] = true;

      Xhr.ajax({
        error: function () {
          _this.onError(serviceName);
          _this.onComplete(serviceName);
        },
        success: function (data/*, xhr*/) {
          _this.onSuccess(serviceName, data, serviceType);
          _this.onComplete(serviceName);
        },
        url: url
      });
    }
  };

  _this.getAllEditions = function (editionId) {
    var all,
        service;

    if (editionId) {
      service = _this.getService(editionId);

      if (service) {
        all = service.editions.data();
      } else {
        all = [];
      }
    } else {
      all = _this.getAllFromAll('editions');
    }

    all.sort(function (a,b) {
      return a.get('displayorder') - b.get('displayorder');
    });

    return all;
  };

  /**
   * Get a unique listing (based on model id) of available models across all
   * available services.
   *
   * @param typeName {String}
   *      The name of the type for which to fetch models. i.e. "editions",
   *      "regions", "siteClasses", "spectralPeriods"
   *
   * @return {Array}
   *      An array containing models corresponding to a unique set of models
   *      of the given typeName across all services.
   */
  _this.getAllFromAll = function (typeName) {
    var all,
        data,
        i,
        len,
        serviceName,
        serviceType,
        services;

    all = {};

    // Use an object to create a unique list
    for (serviceType in _this.services) {
      services = _this.services[serviceType];

      for (serviceName in services) {
        data = services[serviceName][typeName].data();
        len = data.length;

        for (i = 0; i < len; i++) {
          all[data[i].id] = data[i];
        }
      }
    }

    // Object.keys(_this.services).forEach(function (serviceType) {
    //   var services = _this.services[serviceType];

    //   Object.keys(services).forEach(function (serviceName) {
    //     var collection;

    //     collection = _this.services[serviceName][typeName];

    //     collection.data().forEach(function (model) {
    //       all[model.id] = model;
    //     });
    //   });
    // });

    // Now convert the object to an array
    return Object.keys(all).map(function (key) {
      return all[key];
    });
  };

  _this.getAllRegions = function (editionId) {
    var dependencyFactory,
        edition,
        regions;

    dependencyFactory = _this;

    if (editionId) {
      edition = _this.getEdition(editionId);
      if (!edition) {
        return [];
      }
      regions = edition.get('supports').region || [];

      regions = regions.map(function (regionId) {
        return dependencyFactory.getRegion(regionId, editionId);
      });
    } else {
      regions = _this.getAllFromAll('regions');
    }

    return regions;
  };

  _this.getAllSiteClasses = function (editionId) {
    var all,
        service;

    if (editionId) {
      service = _this.getService(editionId);

      if (service) {
        all = service.siteClasses.data();
      } else {
        all = [];
      }
    } else {
      all = _this.getAllFromAll('siteClasses');
    }

    return all;
  };

  _this.getAllSpectralPeriods = function (editionId) {
    var all,
        service;

    if (editionId) {
      service = _this.getService(editionId);

      if (service) {
        all = service.spectralPeriods.data();
      } else {
        all = [];
      }
    } else {
      all = _this.getAllFromAll('spectralPeriods');
    }

    return all;
  };

  // Edition methods ...

  _this.getEdition = function(id) {
    var service;

    service = _this.getService(id);

    if (service) {
      return service.editions.get(id);
    } else {
      return null;
    }
  };

  _this.getEditions = function (ids, editionId) {
    var service;

    service = _this.getService(editionId);

    if (service) {
      return _this.getSupported(service.editions, ids);
    } else {
      return [];
    }
  };

  /**
   * Get all Contour Types for the provided Edition
   *
   * @param  editionId {Integer}
   *         Edition model.id
   *
   * @return {Collection} Collection of Contour Type models.
   */
  _this.getFilteredContourTypes = function (editionId, service) {
    var edition,
        ids;

    if (!service) {
      throw new Error('Service name not provided!');
    }

    // get supported countour types
    edition = _this.getEdition(editionId, service);
    ids = edition.get('supports').contourType;

    return _this.getContourTypes(ids);
  };

  // Region methods ...

  _this.getRegion = function (id, editionId) {
    var service;

    service = _this.getService(editionId);

    if (service) {
      return service.regions.get(id);
    } else {
      return null;
    }
  };

  /**
   * Get the first region supported by the given editionId that also contains
   * the point indicated by the given latitude and longitude.
   *
   * @param editionId {String}
   *      The id of the edition.
   * @param latitude {Number}
   *      Decimal degrees latitude for the point of interest.
   * @param longitude {Number}
   *      Decimal degrees longitude for the point of interest.
   *
   * @return {Region}
   *      The first region match based on input parameters, or null if no
   *      region is supported.
   */
  _this.getRegionByEdition = function (editionId, location) {
    var edition,
        region,
        regions;

    region = null;

    try {
      edition = _this.getEdition(editionId);
      regions = _this.getRegions(edition.get('supports').region, editionId);

      regions.every(function (r) {
        if (r.contains(location)) {
          region = r;
          // no return is falsey, essentially "break"
        } else {
          return true; // continue
        }
      });
    } catch (e) {
      region = null;
    }

    return region;
  };

  _this.getRegions = function (ids, editionId) {
    var service;

    service = _this.getService(editionId);

    if (service) {
      return _this.getSupported(service.regions, ids);
    } else {
      return [];
    }
  };

  // Service methods ...

  _this.getService = function (editionId, serviceType) {
    var serviceName,
        service,
        services;

    if (serviceType) {
      services = _this.services[serviceType];

      for (serviceName in services) {
        service = services[serviceName];

        if (service.editions && service.editions.get(editionId)) {
          return service;
        } else {
          service = null;
        }
      }
    } else {
      for (serviceType in _this.services) {
        services = _this.services[serviceType];

        for (serviceName in services) {
          service = services[serviceName];

          if (service.editions && service.editions.get(editionId)) {
            return service;
          } else {
            service = null;
          }
        }
      }
    }

    return service;
  };

  _this.getServiceByName = function (serviceName, serviceType) {
    var service,
        type;

    if (serviceType && _this.services.hasOwnProperty(serviceType)) {
      service = _this.services[serviceType][serviceName];
    } else {
      for (type in _this.services) {
        service = _this.services[type][serviceName];
        if (service) {
          break;
        }
      }
    }

    return service;
  };

  _this.getServices = function () {
    return _this.services;
  };

  // Site class methods ...

  _this.getSiteClass = function (id, editionId) {
    var service;

    service = _this.getService(editionId);

    if (service) {
      return service.siteClasses.get(id);
    } else {
      return null;
    }
  };

  _this.getSiteClasses = function (ids, editionId) {
    var service;

    service = _this.getService(editionId);

    if (service) {
      return _this.getSupported(service.siteClasses, ids);
    } else {
      return [];
    }
  };

  // Spectral period methods ...

  _this.getSpectralPeriod = function (id, editionId) {
    var service;

    service = _this.getService(editionId);

    if (service) {
      return service.spectralPeriods.get(id);
    } else {
      return null;
    }
  };

  _this.getSpectralPeriods = function (ids, editionId) {
    var service;

    service = _this.getService(editionId);

    if (service) {
      return _this.getSupported(service.spectralPeriods, ids);
    } else {
      return [];
    }
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
  _this.getSupported = function (collection, ids) {
    return collection.data().filter(function (model) {
      if (ids.indexOf(model.get('id')) !== -1) {
        return true;
      }
    });
  };

  /**
   * Checks if the edition supports deaggregation calculations
   *
   * @param id {String}
   *        Edition ID (i.e. E2008, E2016)
   *
   * @return {Boolean}
   *        A boolean indicating whether or not a deaggregation
   *        calculation is supported.
   */
  _this.isSupportedEdition = function (id) {
    var service;

    service = _this.getService(id, _TYPE_DEAGG);

    if (service && service.editions.get(id)) {
      return true;
    } else {
      return false;
    }
  };

  _this.onComplete = function (serviceName) {
    if (_this.pendingRequests.hasOwnProperty(serviceName)) {
      _this.pendingRequests[serviceName] = null;
      delete _this.pendingRequests[serviceName];
    }

    if (Object.keys(_this.pendingRequests).length === 0) {
      _this.isReady = true;

      _this.callbacks.forEach(function (callback) {
        callback();
      });
    }
  };

  /**
   * Error callback when a service fetch fails
   */
  _this.onError = function (serviceName) {
    throw new Error('Error retreiving data for service: ' + serviceName + '.');
  };

  /**
   * Sets the dependency collections with the default values
   * returned by the Xhr request.
   *
   * @param serviceName {String}
   *      The name for the service to which the data should be associated.
   * @param data {Object}
   *      Data returned from the service fetch request.
   */
  _this.onSuccess = function (serviceName, data, serviceType) {
    var service;

    service = _this.getServiceByName(serviceName, serviceType);

    service.params = data.parameters;
    service.urlStub = data.syntax;

    service.editions = Collection(data.parameters.edition.values.map(Meta));
    service.regions = Collection(data.parameters.region.values.map(Region));
    service.siteClasses = Collection(data.parameters.vs30.values.map(Meta));
    service.spectralPeriods = Collection(data.parameters.imt.values.map(Meta));
  };

  /**
   * Build an array of callbacks to be executed when the
   * Xhr request is returned.
   *
   * @param  callback {Function}
   *         a callback to be called by the Xhr success callback
   */
  _this.whenReady = function (callback) {
    if (_this.isReady) {
      callback();
    } else {
      _this.callbacks.push(callback);
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
  _INSTANCE = DependencyFactory(params);
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

  // return an instance of the Dependency Factory
  return _INSTANCE;
};

module.exports = {
  'getInstance': _getInstance,
  'TYPE_CURVE': _TYPE_CURVE,
  'TYPE_DEAGG': _TYPE_DEAGG
};
