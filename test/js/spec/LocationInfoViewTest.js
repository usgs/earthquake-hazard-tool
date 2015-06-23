/* global chai, describe, it */
'use strict';

var LocationInfoView = require('LocationInfoView');

var expect = chai.expect;

describe('LocationInfoView', function () {
  describe('Constructor', function () {
    it('Can be defined', function () {
      /* jshint -W030 */
      expect(LocationInfoView).not.to.be.undefined;
      /* jshint +W030 */
    });
  });
});
