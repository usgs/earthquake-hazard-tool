'use strict';


var HazardResponse = require('HazardResponse'),

    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _DEFAULTS = {
  'staticcurve': {
    metaUrl: '/hazws/staticcurve/1/',
    urlStub: null,
    params: null,
    constructor: HazardResponse
  }
};


var Calculator = function (params) {
  var _this,
      _initialize,

      _pendingServiceDetailsRequests,
      _services,

      _fetchServiceDetails;


  _this = {
    destroy: null,
    getParameters: null,
    getResult: null
  };

  _initialize = function (params) {
    var service;

    _services = Util.extend({}, _DEFAULTS, params);
    _pendingServiceDetailsRequests = {};

    for (service in _services) {
      if (_services.hasOwnProperty(service)) {
        _fetchServiceDetails(service);
      }
    }
  };


  _fetchServiceDetails = function (serviceName, callback) {
    if (_services[serviceName].params) {
      if (callback) {
        callback(_services[serviceName].params);
      }
    } else {
      if (callback) {
        if (!_pendingServiceDetailsRequests.hasOwnProperty(serviceName)) {
          _pendingServiceDetailsRequests[serviceName] = [];
        }
        _pendingServiceDetailsRequests[serviceName].push(callback);
      }

      Xhr.ajax({
        url: _services[serviceName].metaUrl,
        success: function (response) {
          _services[serviceName].urlStub = response.syntax;
          _services[serviceName].params = response.parameters;

          if (_pendingServiceDetailsRequests.hasOwnProperty(serviceName)) {
            _pendingServiceDetailsRequests[serviceName].forEach(function (cb) {
              cb(_services[serviceName].params);
            });

            _pendingServiceDetailsRequests[serviceName] = null;
            delete _pendingServiceDetailsRequests[serviceName];
          }
        }
      });
    }
  };


  _this.destroy = function () {
    _services = null;
    _pendingServiceDetailsRequests = null;

    _fetchServiceDetails = null;

    _this = null;
  };

  /**
   * Determines the parameters required in order to make a call to getResult
   * for the given named service. This method may proceed asynchronously and
   * the callback (if provided) is invoked with a single argument that is an
   * object containg the required parameters for the named service.
   *
   * @param serviceName {String}
   *      The name of the service for which to get the parameters.
   * @param callback {Function}
   *      The function to call once parameters have been fetched.
   */
  _this.getParameters = function (serviceName, callback) {
    if (!_services.hasOwnProperty(serviceName)) {
      throw new Error('No such service [' + serviceName + '] recognized.');
    }

    if (_services[serviceName].params !== null) {
      if (callback) {
        callback(_services[serviceName].params);
      }
    } else {
      _fetchServiceDetails(serviceName, callback);
    }
  };

  /**
   * Interacts with the web service for the named service and upon receiving
   * results, sets the results to the serviceName property on the input
   * analysis.
   *
   * @param service {Object}
   *      The service from which to get the result.
   * @param analysis {Analysis}
   *      The analysis onto which the result will be set once computed.
   * @param callback {Function} Optional.
   *      A callback function that will be invoked an object containing
   *      the name of the service, the input analysis, and the computed result.
   */
  _this.getResult = function (service, analysis, callback) {
    var input,
        paramName,
        params,
        url;

    params = service.params;
    url = service.urlStub;

    if (url === null || params === null) {
      throw new Error('URL and Params must be set before using a service.');
    }

    for (paramName in params) {
      if (paramName === 'latitude' || paramName === 'longitude') {
        // these come off of the 'location'
        input = analysis.get('location')[paramName];
      } else if (paramName === 'imt') {
        input = 'any';
      } else {
        input = analysis.get(paramName);
      }

      if (typeof input === 'undefined' || input === null) {
        throw new Error('Invalid input parameters for given service name.');
      }
      if (input.get) {
        url = url.replace('{' + paramName + '}', input.get('value'));
      } else {
        url = url.replace('{' + paramName + '}', input);
      }
    }

    Xhr.ajax({
      url: url,
      success: function (response) {
        analysis.set({'curves': HazardResponse(response.response)});

        if (callback) {
          callback({analysis: analysis, service: service});
        }
      }
    });
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Calculator;
