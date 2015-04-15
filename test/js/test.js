/* global mocha */

'use strict';

mocha.ui('bdd');

// Add each test class here as they are implemented
require('./spec/CalculatorTest');
require('./spec/MapViewTest');
require('./spec/HazardCurveGraphViewTest');
require('./spec/HazardUtilTest');
require('./spec/ScaffoldingTest');
require('./spec/StaticCurveInputViewTest');

if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
} else {
  mocha.run();
}
