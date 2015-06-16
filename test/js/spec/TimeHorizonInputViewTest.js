/* global chai, describe, it */
'use strict';

var TimeHorizonInputView = require('TimeHorizonInputView');

var expect = chai.expect;

describe('TimeHorizonInputViewTest', function () {
  describe('Constructor', function () {
    it('Can be defined', function () {
      /* jshint -W030 */
      expect(TimeHorizonInputView).not.to.be.undefined;
      /* jshint +W030 */
    });
  });
});