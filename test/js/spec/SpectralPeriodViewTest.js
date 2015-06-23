/* global chai, describe, it */
'use strict';

var SpectralPeriodView = require('SpectralPeriodView');

var expect = chai.expect;

describe('SpectralPeriod test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = SpectralPeriodView();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});