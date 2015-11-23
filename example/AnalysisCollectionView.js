'use strict';

var Analysis = require('Analysis'),
    AnalysisCollectionView = require('AnalysisCollectionView'),
    Meta = require('Meta'),
    Region = require('Region'),

    Collection = require('mvc/Collection'),

    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'curve/data.json',
  success: function (data) {
    var analyses;

    analyses = data.response.map(function (response, index) {
      var metadata;

      metadata = response.metadata;

      return Analysis({
        'id': index,

        'edition': Meta(metadata.edition),
        'region': Region(metadata.region),

        'latitude': metadata.latitude,
        'longitude': metadata.longitude,

        'imt': Meta(metadata.imt),
        'vs30': Meta(metadata.vs30)
      });
    });

    AnalysisCollectionView({
      el: document.querySelector('#example'),
      collection: Collection(analyses)
    });
  }
});
