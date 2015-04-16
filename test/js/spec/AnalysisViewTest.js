/* global chai, describe, it */
'use strict';

var AnalysisView = require('AnalysisView');

var expect = chai.expect;

describe('AnalysisView test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = AnalysisView();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});
