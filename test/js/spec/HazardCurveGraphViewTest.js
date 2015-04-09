/* global chai, describe, it */
'use strict';

var expect = chai.expect,
    HazardCurveGraphView = require('HazardCurveGraphView');


describe('Unit tests for "HazardCurveGraphView"', function () {

  describe('Factory', function () {
    it('is defined', function () {
      expect(HazardCurveGraphView).to.not.equal(null);
    });

    it('can be created and destroyed', function () {
      var view = HazardCurveGraphView();
      view.destroy();
    });
  });

});
