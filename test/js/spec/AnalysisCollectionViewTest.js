/* global chai, describe, it */
'use strict';

var AnalysisCollectionView = require('AnalysisCollectionView');

var expect = chai.expect;

describe('AnalysisCollectionView test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = AnalysisCollectionView();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});
