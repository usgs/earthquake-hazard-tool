/* global chai, describe, it, sinon */
'use strict';

var L = require('leaflet');

require('map/Fullscreen');

var expect = chai.expect;

var _fireClickEvent = function (target) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
  target.dispatchEvent(clickEvent);
};


describe('Fullscreen', function () {
  describe('initialize', function () {
    it('can be instantiated without blowing up', function () {
      var instantiate;

      instantiate = function () {
        L.control.fullscreen();
      };

      expect(instantiate).to.not.throw(Error);
    });
  });


  describe('_onControlClick', function () {
    it('is called when button is clicked', function () {
      var clickSpy,
          container,
          control,
          button,
          map;

      container = document.createElement('div');
      map = L.map(container);
      control = L.control.fullscreen();

      clickSpy = sinon.spy(control, '_onControlClick');
      control.addTo(map);

      button = container.querySelector('.leaflet-control-fullscreen');
      _fireClickEvent(button);

      expect(clickSpy.callCount).to.equal(1);

      clickSpy.restore();
    });

    it('toggles the fullscreen css class', function () {
      var container,
          control,
          map;

      container = document.createElement('div');
      map = L.map(container);
      control = L.control.fullscreen();

      control.addTo(map);
      expect(container.classList.contains('leaflet-map-fullscreen'))
          .to.equal(false);

      control._onControlClick();
      expect(container.classList.contains('leaflet-map-fullscreen'))
          .to.equal(true);

      control._onControlClick();
      expect(container.classList.contains('leaflet-map-fullscreen'))
          .to.equal(false);
    });
  });
});
