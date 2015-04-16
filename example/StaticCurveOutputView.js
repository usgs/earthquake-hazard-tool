'use strict';

var Analysis = require('Analysis'),
    HazardResponse = require('HazardResponse'),
    Meta = require('Meta'),
    Region = require('Region'),
    StaticCurveOutputView = require('StaticCurveOutputView'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),

    Xhr = require('util/Xhr');


var SEQUENCE_ID = 0;

var _analyses,
    _selecter,
    _view,

    _createAnalysis,
    _onData;


_createAnalysis = function (response) {
  var metadata;

  metadata = response.metadata;

  return Analysis({
    id: SEQUENCE_ID++,
    edition: Meta(metadata.edition),
    region: Region(metadata.region),
    longitude: metadata.longitude,
    latitude: metadata.latitude,
    imt: Meta(metadata.imt),
    vs30: Meta(metadata.vs30),
    staticcurve: HazardResponse(response)
  });
};

_onData = function (response) {
  _analyses = Collection(response.response.map(_createAnalysis));

  _view = StaticCurveOutputView({
    el: document.querySelector('.outputview'),
    collection: _analyses
  });

  _selecter = CollectionSelectBox({
    el: document.querySelector('.analysis-select'),
    collection: _analyses,
    format: function (item) {
      return item.id;
    }
  });

  _analyses.select(_analyses.data()[0]);
  _view.onTabSelect(); // Must enable the view
};

Xhr.ajax({
  url: 'data.json',
  success: _onData
});
