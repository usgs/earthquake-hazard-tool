/* global chai, describe, it, before */
'use strict';

var expect = chai.expect,
    HazardCurveDataView = require('HazardCurveDataView'),
    HazardResponse = require('HazardResponse'),
    Xhr = require('util/Xhr');

var hazardCurveDataViewElement = document.createElement('div'),
    hazardCurveDataView;

describe('Unit tests for "HazardCurveDataView"', function () {

  before(function (done) {
    Xhr.ajax({
      url: 'data.json',
      success: function (data) {
        var response = data.response[0];

         hazardCurveDataView = HazardCurveDataView({
          el: hazardCurveDataViewElement,
          response: HazardResponse(response)
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

      expect(table).not.to.be.null;
    });
  });

  // describe('Collection', function () {
  //   it('Can select an object within the collection', function () {
  //     var tableCell = hazardCurveDataViewElement.querySelector('td');

  //     // trigger a click event
  //     tableCell.click();

  //     expect(tableCell.classList.contains('selected')).to.be.equal(true);
  //   });
  // });

});
