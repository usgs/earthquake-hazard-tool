/* global chai, describe, it */
'use strict';

var DeaggResponse = require('deagg/DeaggResponse'),

    rawResponse = require('etc/deagg').response[0];


var expect = chai.expect;


describe('DeaggResponse', function () {
  describe('Constructor', function () {
    it('can be required', function () {
      /* jshint -W030 */
      expect(DeaggResponse).not.to.be.undefined;
      /* jshint +W030 */
    });

    it('can be instantiated', function () {
      expect(DeaggResponse).not.to.throw(Error);
    });

    it('properly parses a response', function () {
      var deaggResponse;

      deaggResponse = DeaggResponse(rawResponse);

      expect(deaggResponse.get('imt')).to.equal('PGA');
      expect(deaggResponse.get('rlabel')).to.equal(
          'Closest Distance, rRup (km)');
      expect(deaggResponse.get('mlabel')).to.equal('Magnitude (Mw)');
      expect(deaggResponse.get('εlabel')).to.equal('% Contribution to Hazard');
    });
  });
});
