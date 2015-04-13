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

      _fetchServiceDetails,
      _setServiceDetails;


  _this = {
    destroy: null,
    getParameters: null,
    getResult: null,
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
    if (_services[serviceName].params !== null) {
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
            _pendingServiceDetailsRequests.forEach(function (cb) {
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
    _setServiceDetails = null;
  };

  _this.getParameters = function (serviceName, callback) {
    if (!_services.hasOwnProperty(serviceName)) {
      throw new Error('No such service [' + serviceName + '] recognized.');
    }

    if (_services[serviceName].params !== null) {
      callback(_services[serviceName].params);
    } else {
      _fetchServiceDetails(serviceName, callback);
    }
  };

  _this.getResult = function (serviceName, inputParams, callback) {
    var paramName,
        params,
        service,
        url;

    if (!_services.hasOwnProperty(serviceName)) {
      throw new Error('No such service [' + serviceName + '] recognized.');
    }

    service = _services[serviceName];
    params = service.params;
    url = service.urlStub;

    if (url === null || params === null) {
      _fetchServiceDetails(serviceName, function () {
        _this.getResult(serviceName, inputParams, callback);
      });
    } else {
      for (paramName in params) {
        if (!inputParams.hasOwnProperty(paramName)) {
          throw new Error('Invalid input parameters for given service name.');
        }
        url = url.replace('{' + paramName + '}', inputParams[paramName]);
      }

      Xhr.ajax({
        url: url,
        success: function (response) {
          callback(service.constructor(response.response[0]));
        }
      });
    }
  };



  _initialize(params);
  params = null;
  return _this;
};

module.exports = Calculator;
