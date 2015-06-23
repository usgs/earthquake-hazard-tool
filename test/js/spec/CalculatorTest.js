/* global after, before, chai, describe, it, sinon */
'use strict';

var Analysis = require('Analysis'),
    Calculator = require('Calculator'),
    Meta = require('Meta'),
    Region = require('Region'),

    Xhr = require('util/Xhr');


var data = require('etc/data'),
    expect = chai.expect,
    metadata = require('etc/metadata');

var analysis,
    contourType,
    edition,
    imt,
    latitude,
    longitude,
    region,
    timeHorizon,
    vs30;


edition = Meta(metadata.parameters.edition.values[0]);
region = Region(metadata.parameters.region.values[0]);

longitude = -118.005;
latitude = 35.005;

imt = Meta(metadata.parameters.imt.values[0]);
vs30 = Meta(metadata.parameters.vs30.values[0]);

contourType = Meta(metadata.parameters.contourType.values[0]);
timeHorizon = Meta(metadata.parameters.timeHorizon.values[0]);

analysis = Analysis({
  edition: edition,
  region: region,

  longitude: longitude,
  latitude: latitude,

  imt: imt,
  vs30: vs30,

  contourType: contourType,
  timeHorizon: timeHorizon
});

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
    it('throws an error for unknown services', function () {
      var unknownServiceParams = function () {
        calculator.getParameters('unknownServiceName');
      };
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
        done();
      });
    });

    it('does not re-fetch parameters after fetched', function (done) {
      var callCount = stub.callCount;
      calculator.getParameters('staticcurve', function () {
        expect(stub.callCount).to.equal(callCount);
        done();
      });
    });
  });

  describe('getResult', function () {
    it('throws an error for unknown services', function () {
      var unknownServiceResult = function () {
        calculator.getResult('unknownServiceName');
      };
      expect(unknownServiceResult).to.throw(Error);
    });

    it('throws an error for bad input parameters', function () {
      var badInputParams = function () {
        calculator.getResult('staticcurve', Analysis());
      };

      expect(badInputParams).to.throw(Error);
    });

    it('handles no callback provided', function () {
        var noCallback = function () {
          calculator.getResult('staticcurve', analysis);
        };

        expect(noCallback).to.not.throw(Error);
    });

    it('calls the callback', function (done) {
      calculator.getResult('staticcurve', analysis, function () {
        done();
      });
    });

    it('returns expected results', function (done) {
        calculator.getResult('staticcurve', analysis, function (result) {
          // TODO :: Deal with multiple HazardResponse
          expect(result.result.toJSON().curves.length).to.equal(1);
          done();
        });
    });
  });
});
