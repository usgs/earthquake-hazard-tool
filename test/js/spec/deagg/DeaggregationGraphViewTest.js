/* global chai, describe, it */
'use strict';

var DeaggregationGraphView = require('deagg/DeaggregationGraphView');


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
});
