/* global chai, describe, it */
'use strict';

var expect = chai.expect,
    MapView = require('MapView');


describe('Unit tests for "MapView"', function () {

  describe('Constructor', function () {
    it('Can be defined', function () {
      expect(MapView).not.to.be.undefined;
    });

    it('Can be created and destroyed', function () {
      var view = MapView();
      view.destroy();
    });

    it('Creates a map', function () {
      var _el = document.createElement('div'),
          view = MapView({
            el: _el
          });

      expect(_el.querySelector('.leaflet-container')).not.to.be.undefined;

    });
  });


});
