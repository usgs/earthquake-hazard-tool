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
  });

});
