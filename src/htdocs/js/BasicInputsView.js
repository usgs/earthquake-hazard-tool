'use strict';


var EditionView = require('EditionView'),
    LocationInfoView = require('LocationInfoView'),
    SiteClassView = require('SiteClassView'),
    TimeHorizonInputView = require('TimeHorizonInputView'),
    TimeHorizonSliderView = require('TimeHorizonSliderView'),

    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');


// Default values to be used by constructor
var _DEFAULTS = {
   // ... some defaults ...
};


/**
 * Class: BasicInputView
 *
 * @param params {Object}
 *      Configuration options. See _DEFAULTS for more details.
 */
var BasicInputView = function (params) {
  var _this,
      _initialize,

      _editions,
      _editionEl,
      _editionView,
      _locationInfoEl,
      _locationInfoView,
      _siteClasses,
      _siteClassEl,
      _siteClassView,
      _timeHorizonEl,
      _timeHorizonInputView,
      _timeHorizonSliderView,

      _createView;


  // Inherit from parent class
  params = Util.extend({}, _DEFAULTS, params);
  _this = SelectedCollectionView(params);

  /**
   * @constructor
   *
   */
  _initialize = function () {
    _this.collection = params.collection;

    _editions = params.editions;
    _siteClasses = params.siteClasses;

    _createView();

    _editionView = EditionView({
      collection: _this.collection,
      editions: _editions,
      el: _editionEl
    });

    _locationInfoView = LocationInfoView({
      collection: _this.collection,
      el: _locationInfoEl
    });

    _siteClassView = SiteClassView({
      collection: _this.collection,
      el: _siteClassEl,
      siteClasses: _siteClasses
    });

    _timeHorizonInputView = TimeHorizonInputView({
      collection: _this.collection,
      el: _timeHorizonEl
    });

    _timeHorizonSliderView = TimeHorizonSliderView({
      collection: _this.collection,
      el: _timeHorizonEl
    });
  };


  _createView = function () {
    var el;

    el = _this.el;
    el.innerHTML = [
      '<ul class="basic-inputs">',
        '<li>',
          '<label for="basic-edition-view">Edition</label>',
          '<select id="basic-edition-view"></select>',
        '</li>',
        '<li>',
          '<label for="basic-location-info-view">Location</label>',
          '<div id="basic-location-info-view"></div>',
        '</li>',
        '<li>',
          '<label for="basic-site-class-view">Site Class</label>',
          '<select id="basic-site-class-view"></select>',
        '</li>',
        '<li class="basic-time-horizon-view"></li>',
      '</ul>'
    ].join('');

    _editionEl = el.querySelector('#basic-edition-view');
    _locationInfoEl = el.querySelector('#basic-location-info-view');
    _siteClassEl = el.querySelector('#basic-site-class-view');
    _timeHorizonEl = el.querySelector('.basic-time-horizon-view');
  };


  _this.destroy = Util.compose(function () {
    // views
    _editionView.destroy();
    _locationInfoView.destroy();
    _siteClassView.destroy();
    _timeHorizonInputView.destroy();
    _timeHorizonSliderView.destroy();

    // variables
    _editions = null;
    _editionEl = null;
    _editionView = null;
    _locationInfoEl = null;
    _locationInfoView = null;
    _siteClassEl = null;
    _siteClassView = null;
    _timeHorizonEl = null;
    _timeHorizonInputView = null;
    _timeHorizonSliderView = null;

    // methods
    _createView = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  // Always call the constructor
  _initialize(params);
  params = null;
  return _this;
};


module.exports = BasicInputView;
