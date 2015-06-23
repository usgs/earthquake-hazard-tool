/* global chai, describe, it */
'use strict';

var TimeHorizonSelectView = require('TimeHorizonSelectView');

var expect = chai.expect;

describe('TimeHorizonSelectView test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = TimeHorizonSelectView();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});
