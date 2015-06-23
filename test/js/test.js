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

// Add each test class here as they are implemented
require('./spec/AnalysisViewTest');
require('./spec/AnalysisCollectionViewTest');
require('./spec/ApplicationViewTest');
require('./spec/CalculatorTest');
require('./spec/DependencyFactoryTest');
require('./spec/EditionViewTest');
require('./spec/MapViewTest');
require('./spec/HazardCurveTest');
require('./spec/HazardCurveDataViewTest');
require('./spec/HazardCurveGraphViewTest');
require('./spec/HazardUtilTest');
require('./spec/SiteClassViewTest');
require('./spec/StaticCurveInputViewTest');
require('./spec/StaticCurveOutputViewTest');
require('./spec/TimeHorizonInputViewTest');

if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
} else {
  mocha.run();
}
