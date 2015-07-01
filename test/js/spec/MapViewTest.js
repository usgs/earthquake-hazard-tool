/* global chai, describe, it */
'use strict';

var expect = chai.expect,
    MapView = require('MapView');


describe('Unit tests for "MapView"', function () {

  describe('Constructor', function () {
    it('Can be defined', function () {
      /* jshint -W030 */
      expect(MapView).not.to.be.undefined;
      /* jshint +W030 */
    });

    it('Can be created and destroyed', function () {
      var view = MapView({});
      view.destroy();
    });

    it('Creates a map', function () {
      var _el = document.createElement('div');
      MapView({
        el: _el
      });
      /* jshint -W030 */
      expect(_el.querySelector('.leaflet-container')).not.to.be.undefined;
      /* jshint +W030 */
    });
  });

});
