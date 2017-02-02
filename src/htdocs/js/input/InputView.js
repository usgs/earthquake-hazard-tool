'use strict';

var LocationInput = require('input/Location'),
    TimeHorizonInput = require('input/TimeHorizonInput'),
    // TimeHorizonInputView = require('TimeHorizonInputView'),
    // TimeHorizonSliderView = require('TimeHorizonSliderView'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');


var __to_id = function (model) {
  return model.id;
};

var __to_display = function (model) {
  return model.get('display');
};

var _DEFAULTS = {
  includeBlankOption: true
};

var InputView = function (params) {
  var _this,
      _initialize,

      _dependencyFactory,
      _editionInput,
      _editions,
      _imtInput,
      _imts,
      _locationInput,
      _siteClassInput,
      _siteClasses,
      _timeHorizonInput,

      _createViewSkeleton,
      _destroySubViews,
      _getEdition,
      _getRegionSupport,
      _getValidImts,
      _getValidSiteClasses,
      _initSubViews,
      _onEditionSelect,
      _onImtSelect,
      _onSiteClassSelect;


  params = Util.extend({}, _DEFAULTS, params);
  _this = SelectedCollectionView(params);

  _initialize = function (params) {
    _dependencyFactory = params.dependencyFactory;

    _createViewSkeleton();

    _editions = Collection(_dependencyFactory.getAllEditions());
    _siteClasses = Collection(_dependencyFactory.getAllSiteClasses());
    _imts = Collection(_dependencyFactory.getAllSpectralPeriods());

    _editions.on('select', _onEditionSelect);
    _siteClasses.on('select', _onSiteClassSelect);
    _imts.on('select', _onImtSelect);

    if (_this.model) {
      _initSubViews();
    }
  };


  _createViewSkeleton = function () {
    _this.el.classList.add('input-view');
    _this.el.classList.add('row');
    _this.el.innerHTML = [
      '<ul class="column one-of-two">',
        '<li>',
          '<label>',
            'Edition',
            '<select class="input-edition-view"></select>',
          '</label>',
        '</li>',
        '<li class="input-location-view"></li>',
        '<li>',
          '<label>',
            'Site Class',
            '<select class="input-site-class-view"></select>',
          '</label>',
        '</li>',
      '</ul>',
      '<ul class="column one-of-two">',
        '<li>',
          '<label>',
            'Spectral Period',
            '<select class="input-imt-view"></select>',
          '</label>',
        '</li>',
        '<li class="input-time-horizon-view"></li>',
      '</ul>',
      '</ul>'
    ].join('');
  };

  _destroySubViews = function () {
    _editionInput.destroy();
    _locationInput.destroy();
    _imtInput.destroy();
    _timeHorizonInput.destroy();

    _editionInput = null;
    _locationInput = null;
    _imtInput = null;
    _timeHorizonInput = null;
  };

  _getEdition = function () {
    return _dependencyFactory.getEdition(_this.model.get('edition'));
  };

  _getRegionSupport = function (key) {
    var edition,
        location,
        regions,
        supported;

    supported = {};
    location = _this.model.get('location');
    edition = _getEdition();
    regions = _dependencyFactory.getRegions(
        edition.get('supports').region, edition.id);

    regions.forEach(function (region) {
      if (!region.contains(location)) {
        return; // Continue to next iteration in forEach loop
      }

      region.get('supports')[key].forEach(function (param) {
        supported[param] = true;
      });
    });

    return Object.keys(supported);
  };

  _getValidImts = function () {
    var regionSupport;

    try {
      regionSupport = _getRegionSupport('imt');

      return regionSupport;
    } catch (e) {
      // If anything goes wrong, everything is valid
      return _dependencyFactory.getAllSpectralPeriods().map(__to_id);
    }
  };

  _getValidSiteClasses = function () {
    var regionSupport;

    try {
      regionSupport = _getRegionSupport('vs30');

      return regionSupport;
    } catch (e) {
      // If anything goes wrong, everything is valid
      return _dependencyFactory.getAllSiteClasses().map(__to_id);
    }
  };

  _initSubViews = function () {
    // All editions are always valid, so default implementation works...
    _editionInput = CollectionSelectBox({
      collection: _editions,
      el: _this.el.querySelector('.input-edition-view'),
      format: __to_display,
      includeBlankOption: true,
      model: _this.model
    });

    _locationInput = LocationInput({
      el: _this.el.querySelector('.input-location-view'),
      model: _this.model
    });

    _siteClassInput = CollectionSelectBox({
      collection: _siteClasses,
      el: _this.el.querySelector('.input-site-class-view'),
      format: __to_display,
      getValidOptions: _getValidSiteClasses,
      includeBlankOption: true,
      model: _this.model
    });

    _imtInput = CollectionSelectBox({
      collection: _imts,
      el: _this.el.querySelector('.input-imt-view'),
      format: __to_display,
      getValidOptions: _getValidImts,
      includeBlankOption: true,
      model: _this.model
    });

    _timeHorizonInput = TimeHorizonInput({
      el: _this.el.querySelector('.input-time-horizon-view'),
      model: _this.model
    });
  };

  _onEditionSelect = function () {
    var edition;

    edition = _editions.getSelected();

    if (_this.model) {
      _this.model.set({
        edition: (edition ? edition.id : null)
      });
    }

    if (_siteClassInput) {
      _siteClassInput.render();
    }

    if (_imtInput) {
      _imtInput.render();
    }
  };

  _onSiteClassSelect = function () {
    var siteClass;

    siteClass = _siteClasses.getSelected();

    if (_this.model) {
      _this.model.set({
        vs30: (siteClass ? siteClass.id : null)
      });
    }
  };

  _onImtSelect = function () {
    var imt;

    imt = _imts.getSelected();

    if (_this.model) {
      _this.model.set({
        imt: (imt ? imt.id : null)
      });
    }
  };


  _this.destroy = Util.compose(function () {
    _destroySubViews();

    // TODO :: Unbind any additional listeners.
    // TODO :: Nullify non-view attributes and methods

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Destroys sub-views then calls parent impementation to free _this.model.
   *
   */
  _this.onCollectionDeselect = Util.compose(_destroySubViews,
      _this.onCollectionDeselect);

  /**
   * Calls parent implementation to set _this.model then initializes sub-views.
   *
   */
  _this.onCollectionSelect = Util.compose(_this.onCollectionSelect,
      _initSubViews);

  _this.render = function () {
    if (_this.model) {
      _editions.selectById(_this.model.get('edition'));
      _siteClasses.selectById(_this.model.get('vs30'));
      _imts.selectById(_this.model.get('imt'));
    } else {
      _editions.deselect();
      _siteClasses.deselect();
      _imts.deselect();
    }
  };

  _initialize(params);
  params = null;
  return _this;
};


module.exports = InputView;
