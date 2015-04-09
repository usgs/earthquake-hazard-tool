/* global mocha */

'use strict';

mocha.ui('bdd');

// Add each test class here as they are implemented
require('./ScaffoldingTest');
require('./spec/HazardCurveGraphViewTest');

if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
} else {
  mocha.run();
}
