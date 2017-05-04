'use strict';


var Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    LocationInput = require('input/Location'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    TimeHorizonInput = require('input/TimeHorizonInput'),
    Util = require('util/Util');


var __to_display,
    __to_id;

__to_id = function (model) {
  return model.id;
};

__to_display = function (model) {
  return model.get('display');
};


var _DEFAULTS;

_DEFAULTS = {
  includeBlankOption: true
};


var InputView = function (params) {
  var _this,
      _initialize;


  params = Util.extend({}, _DEFAULTS, params);
  _this = SelectedCollectionView(params);

  _initialize = function (params) {
    _this.dependencyFactory = params.dependencyFactory;

    _this.createViewSkeleton();

    _this.editions = Collection(_this.dependencyFactory.getAllEditions());
    _this.siteClasses = Collection(_this.dependencyFactory.getAllSiteClasses());
    _this.imts = Collection(_this.dependencyFactory.getAllSpectralPeriods());

    _this.editions.on('select', 'onEditionSelect', _this);
    _this.siteClasses.on('select', 'onSiteClassSelect', _this);
    _this.siteClasses.on('deselect', 'onSiteClassSelect', _this);
    _this.imts.on('select', 'onImtSelect', _this);
    _this.imts.on('deselect', 'onImtSelect', _this);

    if (_this.model) {
      _this.initSubViews();
    }
  };


  _this.createViewSkeleton = function () {
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

  _this.destroy = Util.compose(function () {
    _this.destroySubViews();

    _this.editions.off('select', 'onEditionSelect', _this);
    _this.siteClasses.off('select', 'onSiteClassSelect', _this);
    _this.siteClasses.off('deselect', 'onSiteClassSelect', _this);
    _this.imts.off('select', 'onImtSelect', _this);
    _this.imts.off('deselect', 'onImtSelect', _this);

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.destroySubViews = function () {
    _this.editionInput.destroy();
    _this.locationInput.destroy();
    _this.imtInput.destroy();
    _this.timeHorizonInput.destroy();

    _this.editionInput = null;
    _this.locationInput = null;
    _this.imtInput = null;
    _this.timeHorizonInput = null;
  };

  _this.getEdition = function () {
    return _this.dependencyFactory.getEdition(_this.model.get('edition'));
  };

  _this.getRegionSupport = function (key) {
    var edition,
        location,
        regions,
        supported;

    supported = {};
    location = _this.model.get('location');
    edition = _this.getEdition();
    regions = _this.dependencyFactory.getRegions(
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

  _this.getValidImts = function () {
    var regionSupport;

    try {
      regionSupport = _this.getRegionSupport('imt');

      return regionSupport;
    } catch (e) {
      // If anything goes wrong, everything is valid
      return _this.dependencyFactory.getAllSpectralPeriods().map(__to_id);
    }
  };

  _this.getValidSiteClasses = function () {
    var regionSupport;

    try {
      regionSupport = _this.getRegionSupport('vs30');

      return regionSupport;
    } catch (e) {
      // If anything goes wrong, everything is valid
      return _this.dependencyFactory.getAllSiteClasses().map(__to_id);
    }
  };

  _this.initSubViews = function () {
    // All editions are always valid, so default implementation works...
    _this.editionInput = CollectionSelectBox({
      collection: _this.editions,
      el: _this.el.querySelector('.input-edition-view'),
      format: __to_display,
      includeBlankOption: true,
      model: _this.model
    });

    _this.locationInput = LocationInput({
      el: _this.el.querySelector('.input-location-view'),
      model: _this.model
    });

    _this.siteClassInput = CollectionSelectBox({
      collection: _this.siteClasses,
      el: _this.el.querySelector('.input-site-class-view'),
      format: __to_display,
      getValidOptions: _this.getValidSiteClasses,
      includeBlankOption: true,
      model: _this.model
    });

    _this.imtInput = CollectionSelectBox({
      collection: _this.imts,
      el: _this.el.querySelector('.input-imt-view'),
      format: __to_display,
      getValidOptions: _this.getValidImts,
      includeBlankOption: true,
      model: _this.model
    });

    _this.timeHorizonInput = TimeHorizonInput({
      el: _this.el.querySelector('.input-time-horizon-view'),
      model: _this.model
    });
  };

  /**
   * Destroys sub-views then calls parent impementation to free _this.model.
   *
   */
  _this.onCollectionDeselect = Util.compose(_this.destroySubViews,
      _this.onCollectionDeselect);

  /**
   * Calls parent implementation to set _this.model then initializes sub-views.
   *
   */
  _this.onCollectionSelect = Util.compose(_this.onCollectionSelect,
      _this.initSubViews);

  _this.onEditionSelect = function () {
    var edition;

    edition = _this.editions.getSelected();

    if (_this.model) {
      _this.model.set({
        edition: (edition ? edition.id : null),
        curveServiceUrl: null,
        deaggServiceUrl: null
      });
    }

    if (_this.siteClassInput) {
      _this.siteClassInput.render();
    }

    if (_this.imtInput) {
      _this.imtInput.render();
    }
  };

  _this.onImtSelect = function () {
    var imt;

    imt = _this.imts.getSelected();

    if (_this.model) {
      _this.model.set({
        imt: (imt ? imt.id : null),
        curveServiceUrl: null,
        deaggServiceUrl: null
      });
    }
  };

  _this.onSiteClassSelect = function () {
    var siteClass;

    siteClass = _this.siteClasses.getSelected();

    if (_this.model) {
      _this.model.set({
        vs30: (siteClass ? siteClass.id : null),
        rawDataUrl: null
      });
    }
  };

  _this.render = function () {
    if (_this.model) {
      _this.editions.selectById(_this.model.get('edition'));
      _this.siteClasses.selectById(_this.model.get('vs30'));
      _this.imts.selectById(_this.model.get('imt'));
    } else {
      _this.editions.deselect();
      _this.siteClasses.deselect();
      _this.imts.deselect();
    }
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = InputView;
