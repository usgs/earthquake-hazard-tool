/* global chai, describe, it */
'use strict';

var //DependencyFactory = require('DependencyFactory'),
    Location = require('input/Location');

var expect = chai.expect;

var edition,
    locationFail,
    locationPass;

edition = 'E2014R1';

locationFail = {
  edition: 'E2014R1',
  location: {
    confidence: -1,
    latitude: 38,
    longitude: -118,
    method: 'coordinate',
    place: ''
  }
};

locationPass = {
  confidence: -1,
  latitude: 38,
  longitude: -118,
  method: 'coordinate',
  place: ''
};

describe('LocationTest', function () {
  describe('Constructor', function () {
    it('Can be defined', function () {
      /* jshint -W030 */
      expect(Location).not.to.be.undefined;
      /* jshint +W030 */
    });

    it('can be destroyed', function () {
      var view;

      view = Location();
      expect(view.destroy).to.not.throw('Error');

      view.destroy();
    });
  });

  // describe('displayErrorMessage', function () {
  //   it('reformats text correctly', function () {
  //     var view;
  //
  //     view = Location({model: locationFail});
  //     view.render();
  //     expect(view.querySelector('.usa-input-error-message').innerHTML).to.equal('');
  //   });
  // });
    // it('calls displayErrorMessage', function () {
    //   var dependencyFactory,
    //       stub,
    //       view,
    //       spy;
    //
    //   spy = sinon.spy(view, 'displayErrorMessage');
    //
    //   dependencyFactory = DependencyFactory.getInstance();
    //   view = Location();
    //   stub = sinon.stub(dependencyFactory, 'getRegionByEdition', function () {
    //     return null;
    //   });
    //
    //   view.checkLocation();
    //
    //   expect(spy.callCount).to.equal(1);
    //
    //   stub.restore();
    //   view.destroy();
    // });

});
