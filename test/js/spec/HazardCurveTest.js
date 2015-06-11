/* global afterEach, beforeEach,chai, describe, it, sinon */
'use strict';

var HazardCurve = require('HazardCurve'),
    HazardUtil = require('HazardUtil');

var expect = chai.expect;

var data = [
  [1,1.5],
  [2,2.5],
  [3,3.5],
  [4,4.5],
  [5,5.5]
];

var hazardCurve = HazardCurve({
  data: data
});

describe('HazardCurveTest', function () {
  describe('Constructor', function () {
    it('is defined', function () {
      expect(hazardCurve).to.not.equal(null);
    });
  });

  describe('Test getX and getY', function () {
    beforeEach(function () {
      sinon.spy(HazardUtil, 'interpolateLogLog');
    });

    afterEach(function () {
      HazardUtil.interpolateLogLog.restore();
    });

    it('getX passes the correct values', function () {
      var args;

      hazardCurve.getX(2.25);
      expect(HazardUtil.interpolateLogLog.calledOnce).to.equal(true);
      args = HazardUtil.interpolateLogLog.getCall(0).args;
      expect(args[0]).to.equal(1.5);
      expect(args[1]).to.equal(1);
      expect(args[2]).to.equal(2.5);
      expect(args[3]).to.equal(2);
      expect(args[4]).to.equal(2.25);
    });

    it('getX does not interploate when a value exists', function () {
      expect(hazardCurve.getX(3.5)).to.equal(3);
    });

    it('getY passes the correct values', function () {
      var args;

      hazardCurve.getY(2.25);
      expect(HazardUtil.interpolateLogLog.calledOnce).to.equal(true);
      args = HazardUtil.interpolateLogLog.getCall(0).args;
      expect(args[0]).to.equal(2);
      expect(args[1]).to.equal(2.5);
      expect(args[2]).to.equal(3);
      expect(args[3]).to.equal(3.5);
      expect(args[4]).to.equal(2.25);
    });

    it('getY does not interpolate when a value exists', function () {
      expect(hazardCurve.getY(3)).to.equal(3.5);
    });



  });
});