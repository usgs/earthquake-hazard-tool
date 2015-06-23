/* global chai, describe, it */
'use strict';

var TimeHorizonSliderView = require('TimeHorizonSliderView');

var expect = chai.expect;

describe('TimeHorizonSliderView test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = TimeHorizonSliderView();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});
