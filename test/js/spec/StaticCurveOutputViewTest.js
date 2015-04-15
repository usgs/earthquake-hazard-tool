/* global chai, describe, it */
'use strict';

var StaticCurveOutputView = require('StaticCurveOutputView');


var expect = chai.expect;

describe('StaticCurveOutputView', function () {
  describe('Constructor', function () {
    it('it is defined', function () {
      /* jshint -W030 */
      expect(StaticCurveOutputView).to.not.be.undefined;
      /* jshint +W030 */
    });

    it('it can be created and destroyed', function () {
      var testit = function () {
        var view = StaticCurveOutputView();
        view.destroy();
      };

      expect(testit).to.not.throw(Error);
    });
  });
});
