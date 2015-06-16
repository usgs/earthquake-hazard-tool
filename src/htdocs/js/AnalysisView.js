'use strict';

var Analysis = require('Analysis'),

    View = require('mvc/View'),

    Util = require('util/Util');


var AnalysisView = function (params) {
  var _this,
      _initialize,

      _locationEl,
      _model,
      _paramsEl,
      _titleEl,

      _createViewSkeleton,
      _onModelChange;


  _this = View(params||{});

  _initialize = function (params) {
    params = params || {};

    _model = params.model || Analysis({id: (new Date()).getTime()});
    _this.id = _model.id;

    _this.el.setAttribute('data-analysis-id', _model.id);
    _createViewSkeleton();

    _this.render();
  };


  _createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<span class="analysis-view-title"></span>',
      '<span class="analysis-view-metadata">',
        '<span class="analysis-view-location"></span>',
        '<span class="analysis-view-params"></span>',
      '</span>'
    ].join('');

    _titleEl = _this.el.querySelector('.analysis-view-title');
    _locationEl = _this.el.querySelector('.analysis-view-location');
    _paramsEl = _this.el.querySelector('.analysis-view-params');
  };

  _this.destroy = Util.compose(_this.destroy, function () {
    _model.off('change', _onModelChange);

    _locationEl = null;
    _model = null;
    _paramsEl = null;
    _titleEl = null;

    _createViewSkeleton = null;
    _onModelChange = null;

    _initialize = null;
    _this = null;
  });

  _this.render = function () {
    var edition,
        imt,
        latitude,
        longitude,
        region,
        txtTitle,
        txtLocation,
        txtParams,
        vs30;

    edition = _model.get('edition');
    region = _model.get('region');

    longitude = _model.get('longitude');
    latitude = _model.get('latitude');

    imt = _model.get('imt');
    vs30 = _model.get('vs30');

    if (edition) {
      txtTitle = edition.get('display');
    } else {
      txtTitle = 'Unknown';
    }

    if (latitude !== null && longitude !== null) {
      txtLocation = '(' + latitude.toFixed(3) + ', ' +
          longitude.toFixed(3) + ')';
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

    _titleEl.innerHTML = txtTitle;
    _locationEl.innerHTML = txtLocation;
    _paramsEl.innerHTML = txtParams;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = AnalysisView;
