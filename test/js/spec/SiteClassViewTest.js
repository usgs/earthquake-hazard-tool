/* global chai, describe, it */
'use strict';

var SiteClassView = require('SiteClassView');

var expect = chai.expect;

describe('SiteClassView test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = SiteClassView();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});
