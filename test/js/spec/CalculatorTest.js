/* global afterEach, beforeEach, chai, describe, it, sinon */
'use strict';

var Calculator = require('Calculator'),
    Xhr = require('util/Xhr');


var data = require('etc/data'),
    expect = chai.expect,
    metadata = require('etc/metadata');

describe('Calculator', function () {

  var calculator,
      stub;

  before(function (done) {
    stub = sinon.stub(Xhr, 'ajax', function (options) {
      options.success(metadata);
    });

    calculator = Calculator();
    calculator.getParameters('staticcurve', function () {
      stub.restore();

      stub = sinon.stub(Xhr, 'ajax', function (options) {
        options.success(data);
      });

      done();
    });
  });

  after(function () {
    calculator.destroy();
    stub.restore();
  });

  describe('Constructor', function () {
    it('can be constructed without blowing up', function () {

      expect(calculator).to.respondTo('destroy');
      expect(calculator).to.respondTo('getParameters');
      expect(calculator).to.respondTo('getResult');
    });
  });

  describe('getParameters', function () {
    var calculator = Calculator();
    it('throws an error for unknown services', function () {
      var unknownServiceParams = function () {
        calculator.getParameters('unknownServiceName');
      }
      expect(unknownServiceParams).to.throw(Error);
    });

    it('handles no callback provided', function () {
      var noCallback = function () {
        calculator.getParameters('staticcurve');
      };

      expect(noCallback).to.not.throw(Error);
    });

    it('calls the callback', function (done) {
      calculator.getParameters('staticcurve', function () {
        done()
      });
    });

    it('does not re-fetch parameters after fetched', function (done) {
      var callCount = stub.callCount;
      calculator.getParameters('staticcurve', function (parameters) {

        expect(stub.callCount).to.equal(callCount);
        done();
      });
    });
  });

  describe('getResult', function () {
    it('throws an error for unknown services', function () {
      var unknownServiceResult = function () {
        calculator.getResult('unknownServiceName');
      }
      expect(unknownServiceResult).to.throw(Error);
    });

    it('throws an error for bad input parameters', function () {
      var badInputParams = function () {
        calculator.getResult('staticcurve', {});
      };

      expect(badInputParams).to.throw(Error);
    });

    it('handles no callback provided', function () {
        var noCallback = function () {
          calculator.getResult('staticcurve', {
            edition: 'E2014R1',
            region: 'COUS0P05',
            longitude: -118.0,
            latitude: 34.0,
            imt: 'PGA',
            vs30: '760'
          });
        };

        expect(noCallback).to.not.throw(Error);
    });

    it('calls the callback', function (done) {
      calculator.getResult('staticcurve', {
        edition: 'E2014R1',
        region: 'COUS0P05',
        longitude: -118.0,
        latitude: 34.0,
        imt: 'PGA',
        vs30: '760'
      }, function () {
        done();
      });
    });

    it('returns expected results', function (done) {

        calculator.getResult('staticcurve', {
          edition: 'E2014R1',
          region: 'COUS0P05',
          longitude: -118.0,
          latitude: 34.0,
          imt: 'PGA',
          vs30: '760'
        }, function (result) {
          var actual = result.toJSON(),
              expected = data.response[0].metadata;

          expect(actual.edition.id).to.equal(expected.edition.id);
          expect(actual.region.id).to.equal(expected.region.id);

          expect(actual.longitude).to.equal(expected.longitude);
          expect(actual.latitude).to.equal(expected.latitude);

          expect(actual.imt.id).to.equal(expected.imt.id);
          expect(actual.vs30.id).to.equal(expected.vs30.id);

          expect(actual.curves.length).to.equal(1);

          // TODO :: Deal with multiple HazardResponse
          done();
        });
    });
  });
});
