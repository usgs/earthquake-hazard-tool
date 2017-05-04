'use strict';


var Calculator = require('Calculator'),
    Collection = require('mvc/Collection');


var DeaggCalculator = function () {
  var _this;

  _this = Calculator();

  /**
   * Special handling to fetch "timeHorizon" when "returnPeriod" is requested.
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
      } else if (paramName === 'returnPeriod') {
        input = analysis.get('timeHorizon');
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

  _this.onXhrSuccess = function (url, response, service, analysis) {
    var deaggResponses;

    deaggResponses = Collection(response.response.map(
        require(service.constructor)));

    analysis.set({
      'deaggResponses': deaggResponses,
      'deaggServiceUrl': url
    });
  };


  return _this;
};


module.exports = DeaggCalculator;
