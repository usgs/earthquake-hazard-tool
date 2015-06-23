/* global chai, describe, it */
'use strict';

var TimeHorizon = require('TimeHorizon');

var expect = chai.expect;

describe('TimeHorizon test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = TimeHorizon();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});
