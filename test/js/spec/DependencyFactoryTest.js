/* global chai, describe, it */
'use strict';

var DependencyFactory = require('DependencyFactory');

var expect = chai.expect;

describe('DependencyFactory test suite.', function () {
  describe('Constructor', function () {
    it('can be created and destroyed', function () {
      var createDestroy = function () {
        var view = DependencyFactory();
        view.destroy();
      };

      expect(createDestroy).to.not.throw('Error');
    });
  });
});


