/* global chai, describe, it, sinon */
'use strict';

var Location = require('input/Location'),
    Model = require('mvc/Model');

var expect = chai.expect;

var locationFail,
    locationPass;

locationFail = {
  edition: 'E2014R1',
  location: {
    confidence: -1,
    latitude: 3,
    longitude: -118,
    method: 'coordinate',
    place: ''
  }
};

locationPass = {
  edition: 'E2014R1',
  location: {
    confidence: -1,
    latitude: 3,
    longitude: -118,
    method: 'coordinate',
    place: ''
  }
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

  describe('displayErrorMessage and removeErrorMessage', function () {
    var view;

    view = Location({
      model: Model(locationFail)
    });

    it('shows error message', function () {
      var stub;

      stub = sinon.stub(view.dependencyFactory, 'getAllRegions', function () {
        return [];
      });

      view.displayErrorMessage();

      expect(stub.callCount).to.equal(1);
      expect(view.el.querySelectorAll('.usa-input-error-label').length).
          to.not.equal(0);

      stub.restore();
    });

    it('removes error message', function () {
      view.removeErrorMessage();

      expect(view.el.querySelectorAll('.usa-input-error-label').length).
          to.equal(0);

      view.destroy();
    });
  });

  describe('checkLocation', function () {
    it('calls getRegionByEdition', function () {
      var stub,
          view;

      view = Location({
        model: Model(locationPass)
      });

      stub = sinon.stub(view.dependencyFactory, 'getRegionByEdition',
          function () {
        return null;
      });

      view.checkLocation();

      expect(stub.callCount).to.equal(1);

      stub.restore();
      view.destroy();
    });

    it('calls displayErrorMessage', function () {
      var stub,
          stub2,
          view;

      view = Location({
        model: Model(locationFail)
      });

      stub = sinon.stub(view.dependencyFactory, 'getRegionByEdition',
          function () {
        return null;
      });

      stub2 = sinon.stub(view, 'displayErrorMessage', function () {
        return null;
      });

      view.checkLocation();

      expect(stub2.callCount).to.equal(1);

      stub.restore();
      view.destroy();
    });

    it('calls removeErrorMessage', function () {
      var stub,
          stub2,
          view;

      view = Location();

      stub = sinon.stub(view.dependencyFactory, 'getRegionByEdition',
          function () {
        return true;
      });

      stub2 = sinon.stub(view, 'removeErrorMessage', function () {
        return null;
      });

      view.checkLocation();

      expect(stub2.callCount).to.equal(1);

      stub.restore();
      view.destroy();
    });
  });
});
