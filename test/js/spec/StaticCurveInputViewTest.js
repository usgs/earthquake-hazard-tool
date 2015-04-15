/* global chai, describe, it */
'use strict';

var StaticCurveInputView = require('StaticCurveInputView');


var expect = chai.expect;

describe('StaticCurveInputView', function () {
  describe('show/hide', function () {
    var view = StaticCurveInputView();

    it('is visible after showing', function () {
      view.show();

      /* jshint -W030 */
      expect(document.querySelector('.staticcurve-modal')).to.not.be.null;
      /* jshint +W030 */
    });

    it('is not visisble after hiding', function () {
      view.hide();

      /* jshint -W030 */
      expect(document.querySelector('.staticcurve-modal')).to.be.null;
      /* jshint +W030 */
    });
  });
});
