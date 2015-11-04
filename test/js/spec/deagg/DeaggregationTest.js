/* global chai, describe, it */
'use strict';

var Deaggregation = require('deagg/Deaggregation');


var expect = chai.expect;


describe('Deaggregation', function () {
  describe('Constructor', function () {
    it('is defined', function () {
      /* jshint -W030 */
      expect(Deaggregation).not.to.be.undefined;
      /* jshint +W030 */
    });

    it('can be instantiated', function () {
      expect(Deaggregation).not.to.throw(Error);
    });

    it('has expected attributes', function () {
      var obj;

      obj = Deaggregation();

      /* jshint -W030 */
      expect(obj.get('id')).not.to.be.null;
      expect(obj.get('component')).not.to.be.null;
      expect(obj.get('data')).not.to.be.null;
      /* jshint +W030 */
    });
  });
});
