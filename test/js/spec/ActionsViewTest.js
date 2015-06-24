/* global chai, describe, it */
'use strict';


var ActionsView = require('ActionsView');


var expect = chai.expect;

describe('ActionsView', function () {
  describe('Constructor', function () {
    it('can be required without blowing up', function () {
      expect(true).to.equal(true);
    });

    it('can be instantiated without arguments', function () {
      var noArgConstructor = function () {
        ActionsView();
      };

      expect(noArgConstructor).to.not.throw(Error);
    });

    it('responds to the API methods', function () {
      var view = ActionsView();

      expect(view).to.respondTo('render');
      expect(view).to.respondTo('destroy');
    });
  });
});
