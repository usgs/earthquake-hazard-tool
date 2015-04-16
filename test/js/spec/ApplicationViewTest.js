/* global chai, describe, it */
'use strict';

var ApplicationView = require('ApplicationView');

var expect = chai.expect;

describe('ApplicationView test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = ApplicationView();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});
