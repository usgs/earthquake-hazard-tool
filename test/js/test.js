/* global mocha */

'use strict';

mocha.ui('bdd');

// Add each test class here as they are implemented
require('./spec/ScaffoldingTest');
require('./spec/MapViewTest');
require('./spec/HazardCurveGraphViewTest');

if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
} else {
  mocha.run();
}
