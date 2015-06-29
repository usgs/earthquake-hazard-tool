'use strict';

var DependencyFactory = require('DependencyFactory'),

    Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),

    Util = require('util/Util');

var SALT = 'analysis',
    SEQUENCE = 0;

var Analysis = function (options) {
  var _this,
      _initialize,

      _dependencyFactory,

      _bindCurvesListeners,
      _createUniqueId,
      _originalSet,
      _onCurvesChanged,
      _unbindCurveListeners;


  _this = Model(Util.extend({
    edition: null,
    region: null,

    location: null,

    imt: null,
    vs30: null,

    timeHorizon: null,
    contourType: null,

    curves: Collection([])
  }, options));

  _initialize = function (/*options*/) {
    _dependencyFactory = DependencyFactory.getInstance();

    if (typeof _this.id === 'undefined' || _this.id === null) {
      _this.set({id: _createUniqueId()});
    }

    _bindCurvesListeners();
  };

  _bindCurvesListeners = function () {
    var curves;

    curves = _this.get('curves');
    if (curves) {
      curves.on('add', _onCurvesChanged);
      curves.on('remove', _onCurvesChanged);
      curves.on('reset', _onCurvesChanged);
    }
  };

  _createUniqueId = function () {
    return SALT + '-' + (new Date()).getTime() + '-' + (SEQUENCE++);
  };

  _onCurvesChanged = function () {
    _this.trigger('change:curves');
    _this.trigger('change');
  };

  _unbindCurveListeners = function () {
    var curves;

    curves = _this.get('curves');
    if (curves) {
      curves.off('add', _onCurvesChanged);
      curves.off('remove', _onCurvesChanged);
      curves.off('reset', _onCurvesChanged);
    }
  };

  _this.destroy = Util.compose(_this.destroy, function () {
    _unbindCurveListeners();

    _dependencyFactory = null;

    _createUniqueId = null;
  });

  _originalSet = _this.set;
  _this.set = function (attributes, options) {
    var changingCurves;

    changingCurves = attributes.hasOwnProperty('curves');

    if (changingCurves) {
      _unbindCurveListeners();
    }

    _originalSet.call(_this, attributes, options);

    if (changingCurves) {
      _bindCurvesListeners();
    }
  };

  _this.getEdition = function () {
    return _dependencyFactory.getEdition(_this.get('edition'));
  };

  // Not really needed, but for consistency with other methods ...
  _this.getLocation = function () {
    return _this.get('location');
  };

  _this.getRegion = function () {
    return _dependencyFactory.getRegion(_this.get('region'));
  };

  _this.getVs30 = function () {
    return _dependencyFactory.getSiteClass(_this.get('vs30'));
  };

  _this.getSpectralPeriod = function () {
    return _dependencyFactory.getSpectralPeriod(_this.get('imt'));
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = Analysis;
