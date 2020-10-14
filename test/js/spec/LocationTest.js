/* global chai, describe, it, sinon */
'use strict';

var Location = require('input/Location'),
    Model = require('mvc/Model');

var expect = chai.expect;

var locationFail,
    locationPass;

locationFail = {
  edition: 'E2014R1',
  error: 'error',
  location: null
};

locationPass = {
  edition: 'E2014R1',
  location: {
    confidence: -1,
    latitude: 38,
    longitude: -118,
    method: 'coordinate',
    place: ''
  },
  error: null
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

  describe('addErrorMessage', function () {
    it('shows error message', function () {
      var view;

      view = Location({
        model: Model(locationFail)
      });

      view.addErrorMessage();

      expect(view.el.querySelectorAll('.usa-input-error-label').length).
          to.not.equal(0);

      view.destroy();
    });
  });

  describe('checkError', function () {
    it('calls removeErrorMessage', function () {
      var stub,
          view;

      view = Location({
        model: Model(locationPass)
      });

      stub = sinon .stub(view, 'removeErrorMessage').callsFake(function () {
        return;
      });

      view.checkError();

      expect(stub.callCount).to.equal(1);

      stub.restore();
      view.destroy();
    });

    it('calls addErrorMessage', function () {
      var stub,
          view;

      view = Location({
        model: Model(locationFail)
      });

      stub = sinon .stub(view, 'addErrorMessage').callsFake(function () {
        return;
      });

      view.checkError();

      expect(stub.callCount).to.equal(1);

      stub.restore();
      view.destroy();
    });
  });

  describe('removeErrorMessage', function () {
    it('removes error message', function () {
      var view;

      view = Location({
        model: Model(locationPass)
      });

      view.removeErrorMessage();

      expect(view.el.querySelectorAll('.usa-input-error-label').length).
          to.equal(0);

      view.destroy();
    });
  });
});
