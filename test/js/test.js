/* global mocha */
'use strict';

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to ' +
          'be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis ? this :
              oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

mocha.ui('bdd');

// var staticMeta = require('etc/metadata'),
//     df = require('DependencyFactory').getInstance(staticMeta);

// Add each test class here as they are implemented
require('./spec/ActionsViewTest');
require('./spec/AnalysisViewTest');
require('./spec/AnalysisCollectionViewTest');
require('./spec/ApplicationViewTest');
require('./spec/ContourTypeViewTest');
require('./spec/CalculatorTest');
require('./spec/DataExportTest');
require('./spec/DependencyFactoryTest');
require('./spec/EditionViewTest');
require('./spec/MapViewTest');
require('./spec/HazardCurveTest');
require('./spec/HazardCurveGraphViewTest');
require('./spec/HazardUtilTest');
require('./spec/SiteClassViewTest');
require('./spec/SpectralPeriodViewTest');
require('./spec/TimeHorizonInputViewTest');
require('./spec/TimeHorizonSelectViewTest');
require('./spec/TimeHorizonSliderViewTest');
require('./spec/LocationInfoViewTest');

require('./spec/deagg/DeaggregationTest');
require('./spec/deagg/DeaggResponseTest');
require('./spec/deagg/DeaggregationGraphViewTest');

if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
} else {
  mocha.run();
}
