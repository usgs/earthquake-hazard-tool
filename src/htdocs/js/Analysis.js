'use strict';


var DependencyFactory = require('DependencyFactory'),
    Model = require('mvc/Model'),
    Util = require('util/Util');


var SALT = 'analysis',
    SEQUENCE = 0;

var Analysis = function (options) {
  var _this,
      _initialize;


  _this = Model(Util.extend({
    edition: 'E2014R1',
    region: null,

    location: null,
    error: null,

    imt: 'PGA',
    vs30: '760',

    timeHorizon: 2475,
    contourType: 'hazard',

    curves: null,
    deaggResponses: null
  }, options));


  _initialize = function (/*options*/) {
    _this.dependencyFactory = DependencyFactory.getInstance();

    if (typeof _this.id === 'undefined' || _this.id === null) {
      _this.set({id: _this.createUniqueId()});
    }
  };

  _this.createUniqueId = function () {
    return SALT + '-' + (new Date()).getTime() + '-' + (SEQUENCE++);
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _this.dependencyFactory = null;

    _this.createUniqueId = null;
  });

  _this.getDeaggregation = function () {
    return _this.get('deaggregation');
  };

  _this.getEdition = function () {
    return _this.dependencyFactory.getEdition(_this.get('edition'));
  };

  // Not really needed, but for consistency with other methods ...
  _this.getLocation = function () {
    return _this.get('location');
  };

  _this.getRegion = function () {
    return _this.dependencyFactory.getRegion(_this.get('region'),
        _this.get('edition'));
  };

  _this.getSpectralPeriod = function () {
    return _this.dependencyFactory.getSpectralPeriod(_this.get('imt'),
        _this.get('edition'));
  };

  _this.getVs30 = function () {
    return _this.dependencyFactory.getSiteClass(_this.get('vs30'),
        _this.get('edition'));
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = Analysis;
