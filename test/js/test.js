/* global mocha */

// PhantomJS is missing native bind support,
//     https://github.com/ariya/phantomjs/issues/10522
// Polyfill from:
//     https://developer.mozilla.org
//         /en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    'use strict';

    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5 internal IsCallable
      throw new TypeError('object to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound;

    fBound = function () {
      return fToBind.apply(
          (this instanceof fNOP && oThis ? this : oThis),
          aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

(function () {
  'use strict';

  mocha.ui('bdd');
  mocha.reporter('html');

  // Add each test class here as they are implemented
  // require('./spec/TestFile');

  if (window.mochaPhantomJS) {
      window.mochaPhantomJS.run();
  } else {
    mocha.run();
  }
})(this);
