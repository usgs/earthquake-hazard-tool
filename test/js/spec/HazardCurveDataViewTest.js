/* global chai, describe, it, beforeEach, afterEach */
'use strict';

var expect = chai.expect,
    HazardCurveDataView = require('HazardCurveDataView'),
    HazardResponse = require('HazardResponse'),
    Xhr = require('util/Xhr');

var hazardCurveDataViewElement = document.createElement('div'),
    hazardCurveDataView,
    curves;

var _fireClickEvent = function (target) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
  target.dispatchEvent(clickEvent);
};

describe('Unit tests for "HazardCurveDataView"', function () {

  beforeEach(function (done) {

    document.querySelector('body').appendChild(hazardCurveDataViewElement);

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

  afterEach(function () {
    document.querySelector('body').removeChild(hazardCurveDataViewElement);
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

  describe('Collection', function () {
    it('adds selected class on select', function () {
      var tableCell = hazardCurveDataViewElement.querySelector('td'),
          curveId = tableCell.getAttribute('data-id');

      _fireClickEvent(tableCell);

      // Selected curve is the clicked curve
      expect(curves.getSelected()).to.be.equal(curves.get(curveId));
      expect(tableCell.classList.contains('selected')).to.be.equal(true);
    });
  });

});
