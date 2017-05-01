/* global chai, describe, it */
'use strict';

var DeaggregationGraphView = require('deagg/DeaggregationGraphView'),
    deagg = require('deagg/data').response[0];


var expect = chai.expect;


describe('DeaggregationGraphView', function () {
  describe('Constructor', function () {
    it('is defined', function () {
      /* jshint -W030 */
      expect(DeaggregationGraphView).not.to.be.undefined;
      /* jshint +W030 */
    });

    it('can be instantiated', function () {
      expect(DeaggregationGraphView).not.to.throw(Error);
    });

  });

  describe('calculateBounds', function () {
    it('is defined', function () {
      expect(typeof DeaggregationGraphView.calculateBounds).to.equal('function');
    });

    it('calculates bounds correctly', function () {
      var bounds,
          min,
          max;

      bounds = DeaggregationGraphView.calculateBounds(deagg.data[0].data);
      min = bounds[0];
      // x0
      expect(min[0]).to.equal(5);
      // y0
      expect(min[1]).to.equal(5.05);
      // z0
      expect(min[2]).to.equal(0.00012105037);

      max = bounds[1];
      // x1
      expect(max[0]).to.equal(25);
      // y1
      expect(max[1]).to.equal(6.95);
      // z1
      expect(max[2]).to.equal(18.902772368);
    });
  });
});
