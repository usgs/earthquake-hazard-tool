/* global chai, describe, it, before */
'use strict';

var expect = chai.expect,
    HazardCurveDataView = require('HazardCurveDataView'),
    HazardResponse = require('HazardResponse'),
    Xhr = require('util/Xhr');

var hazardCurveDataViewElement = document.createElement('div'),
    hazardCurveDataView,
    curves;

describe('Unit tests for "HazardCurveDataView"', function () {

  before(function (done) {
    Xhr.ajax({
      url: 'data.json',
      success: function (data) {
        curves = HazardResponse(data.response[0]).get('curves');
        hazardCurveDataView = HazardCurveDataView({
          el: hazardCurveDataViewElement,
          collection: curves
        });
        done();
      }
    });
  });

  describe('Constructor', function () {
    it('Can be defined', function () {
      /* jshint -W030 */
      expect(HazardCurveDataView).not.to.be.undefined;
      /* jshint +W030 */
    });

    it('Can be created and destroyed', function () {
      hazardCurveDataView.destroy();
    });
  });

  describe('Render', function () {
    it('Can create a table', function () {
      var table = hazardCurveDataViewElement.querySelector('table');
      /* jshint -W030 */
      expect(table).not.to.be.null;
      /* jshint +W030 */
    });
  });

});
