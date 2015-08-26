/* global chai, describe, it */
'use strict';

var DataExport = require('DataExport');

var expect = chai.expect;

describe('DataExportTest', function () {
  describe('Constructor', function () {
    it('Can be defined', function () {
      /* jshint -W030 */
      expect(DataExport).not.to.be.undefined;
      /* jshint +W030 */
    });
  });
});
