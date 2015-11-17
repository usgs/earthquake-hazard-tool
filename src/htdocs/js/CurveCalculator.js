'use strict';


var Calculator = require('Calculator');


var CurveCalculator = function () {
  var _this;


  _this = Calculator();

  /**
  * This method is almost like the parseInputs method in Calculator.js.
  * The only difference is that the imt value is always set to 'any' while
  * the parseInputs method in Calculator uses the imt value.
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
    return url;
  };

  return _this;
};

module.exports = CurveCalculator;
