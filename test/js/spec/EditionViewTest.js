/* global chai, describe, it */
'use strict';

var EditionView = require('EditionView');

var expect = chai.expect;

describe('EditionView test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = EditionView();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});
