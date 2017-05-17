'use strict';


var Analysis = require('Analysis'),
    Util = require('util/Util'),
    View = require('mvc/View');


var AnalysisView = function (params) {
  var _this,
      _initialize;


  _this = View(params||{});

  _initialize = function (params) {
    params = params || {};

    _this.model = params.model || Analysis({id: (new Date()).getTime()});
    _this.id = _this.model.id;

    _this.el.setAttribute('data-analysis-id', _this.model.id);
    _this.createViewSkeleton();

    _this.render();
  };


  _this.createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<span class="analysis-view-title"></span>',
      '<span class="analysis-view-metadata">',
        '<span class="analysis-view-location"></span>',
        '<span class="analysis-view-params"></span>',
      '</span>'
    ].join('');

    _this.titleEl = _this.el.querySelector('.analysis-view-title');
    _this.locationEl = _this.el.querySelector('.analysis-view-location');
    _this.paramsEl = _this.el.querySelector('.analysis-view-params');
  };

  _this.destroy = Util.compose(_this.destroy, function () {
    _initialize = null;
    _this = null;
  });

  _this.render = function () {
    var edition,
        imt,
        location,
        region,
        txtTitle,
        txtLocation,
        txtParams,
        vs30;

    edition = _this.model.getEdition();
    region = _this.model.getRegion();

    location = _this.model.getLocation();

    imt = _this.model.getSpectralPeriod();
    vs30 = _this.model.getVs30();

    if (edition) {
      txtTitle = edition.get('display');
    } else {
      txtTitle = 'Unknown';
    }

    if (location && location.latitude !== null && location.longitude !== null) {
      txtLocation = '(' + location.latitude.toFixed(3) + ', ' +
          location.longitude.toFixed(3) + ')';
    } else {
      txtLocation = '(&ndash;, &ndash;)';
    }

    if (imt) {
      txtParams = imt.get('value') + ', ';
    } else {
      txtParams = '&ndash;, ';
    }

    if (region) {
      txtParams += region.get('value') + ', ';
    } else {
      txtParams += '&ndash;, ';
    }

    if (vs30) {
      txtParams += vs30.get('value');
    } else {
      txtParams += '&ndash;';
    }

    _this.titleEl.innerHTML = txtTitle;
    _this.locationEl.innerHTML = txtLocation;
    _this.paramsEl.innerHTML = txtParams;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = AnalysisView;
