'use strict';


var Xhr = require('util/Xhr');


var Calculator = function (/*params*/) {
  var _this;

  _this = {
    getResult: null,
    parseInputs: null,
    callXHR: null
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
    var url;

    url = _this.parseInputs(service.params, service.urlStub, analysis);
    return _this.callXHR(url, service, analysis, callback);
  };

  /**
  * Uses the imt value while CurveCalculator uses a value of any
  */
  _this.parseInputs = function (params, url, analysis) {
    var input,
        paramName;

    if (url === null || params === null) {
      throw new Error('URL and Params must be set before using a service.');
    }

    for (paramName in params) {
      if (paramName === 'latitude' || paramName === 'longitude') {
        // these come off of the 'location'
        input = analysis.get('location')[paramName];
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
    return url;
  };

  _this.callXHR = function (url, service, analysis, callback) {
    return Xhr.ajax({
      url: url,
      success: function (response) {
        analysis.set({
          'curves': require(service.constructor)(response.response)
        });

        if (callback) {
          callback({analysis: analysis, service: service});
        }
      }
    });
  };

  return _this;
};

module.exports = Calculator;
