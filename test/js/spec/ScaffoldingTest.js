/* global chai, describe, it */
'use strict';

var ApplicationView = require('ApplicationView');

var expect = chai.expect;

describe('ApplicationView test suite.', function () {

  // build application scaffolding
  var div = document.createElement('div'),
      applicationView;

  applicationView = ApplicationView({
    el: div
  });

  describe('Constructor', function () {
    it('Instantiates correctly', function () {
      expect(div.innerHTML).to.not.be.equal('');
    });
  });

  describe('OffCanvas', function () {
    it('can toggle the OffCanvas section', function () {
      var toggleButton = div.querySelector('.offcanvas-toggle'),
          offcanvas = null;

      // check before
      offcanvas = div.querySelector('.offcanvas-enabled');
      /* jshint -W030 */
      expect(offcanvas).to.be.null;
      /* jshint +W030 */

      // fire a click event on toggle button
      toggleButton.click();

      // check after
      offcanvas = div.querySelector('.offcanvas-enabled');
      /* jshint -W030 */
      expect(offcanvas).to.not.be.null;
      /* jshint +W030 */
    });
  });
});
