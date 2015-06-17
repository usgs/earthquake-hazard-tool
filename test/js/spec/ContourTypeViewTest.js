/* global chai, describe, it */
'use strict';

var ContourTypeView = require('ContourTypeView');

var expect = chai.expect;

describe('ControurTypeView Test', function () {
  describe('Constructor', function () {
    it('Can be defined', function () {
      /* jshint -W030 */
      expect(ContourTypeView).not.to.be.undefined;
      /* jshint +W030 */
    });
  });
});