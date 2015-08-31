/* global after, before, chai, describe, it, sinon */
'use strict';

var Analysis = require('Analysis'),
    Calculator = require('Calculator'),
    DependencyFactory = require('DependencyFactory'),
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
    vs30;


edition = Meta(metadata.parameters.edition.values[0]);
region = Region(metadata.parameters.region.values[0]);

longitude = -118.005;
latitude = 35.005;

imt = Meta(metadata.parameters.imt.values[0]);
vs30 = Meta(metadata.parameters.vs30.values[0]);

contourType = Meta(metadata.parameters.contourType.values[0]);



describe('Calculator', function () {

  var calculator,
      stub;

  before(function (done) {
    DependencyFactory.getInstance().whenReady(function () {
      analysis = Analysis({
        edition: edition,
        region: region,

        location: {
          latitude: latitude,
          longitude: longitude
        },

        imt: imt,
        vs30: vs30,

        contourType: contourType
      });

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
        calculator.getResult(
            DependencyFactory.getInstance().getService('E2008R3'),
            Analysis());
      };

      expect(badInputParams).to.throw(Error);
    });

    it('handles no callback provided', function () {
        var noCallback = function () {
          calculator.getResult(
              DependencyFactory.getInstance().getService('E2008R3'),
              analysis);
        };

        expect(noCallback).to.not.throw(Error);
    });

    it('calls the callback', function (done) {
      calculator.getResult(
          DependencyFactory.getInstance().getService('E2008R3'),
          analysis, function () {
        done();
      });
    });

    it('returns expected results', function (done) {
        calculator.getResult(
            DependencyFactory.getInstance().getService('E2008R3'),
            analysis, function (result) {
          expect(result.analysis.get('curves').get('curves').data().length)
              .to.equal(6);
          done();
        });
    });
  });
});
