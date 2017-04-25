/* global chai, describe, it */
'use strict';

var TimeHorizonInput = require('input/TimeHorizonInput');

var expect = chai.expect;

describe('TimeHorizonInputTest', function () {
  describe('Constructor', function () {
    it('is defined', function () {
      /* jshint -W030 */
      expect(TimeHorizonInput).not.to.be.undefined;
      /* jshint +W030 */
    });

    it('can be instantiated', function () {
      expect(TimeHorizonInput).not.to.throw(Error);
    });

    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var timeHorizonInput = TimeHorizonInput();
        timeHorizonInput.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});
