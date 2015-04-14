/* global chai, describe, it */
'use strict';

var expect = chai.expect,
    HazardCurveDataView = require('HazardCurveDataView');


describe('Unit tests for "HazardCurveDataView"', function () {

  describe('Constructor', function () {
    it('Can be defined', function () {
      /* jshint -W030 */
      expect(HazardCurveDataView).not.to.be.undefined;
      /* jshint +W030 */
    });

    it('Can be created and destroyed', function () {
      var view = HazardCurveDataView();
      view.destroy();
    });
  });

});
