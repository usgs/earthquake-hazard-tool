'use strict';

var Analysis = require('Analysis'),
    AnalysisCollectionView = require('AnalysisCollectionView'),
    AnalysisCollection = require('mvc/Collection'),
    Meta = require('Meta'),
    Region = require('Region'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'data.json',
  success: function (data) {
    var analysisCollection = new AnalysisCollection(),
        analysis,
        index = Date.now();
    // for (var i = 0, len = data.response.length; i < len; i++) {
    //   analysis = new Analysis();
    //   analysis.set({'id': index++,
    //       'latitude': data.response[i].metadata.latitude,
    //       'longitude': data.response[i].metadata.longitude,
    //       'edition': Meta(data.response[i].metadata.edition),
    //       'region': Region(data.response[i].metadata.region),
    //       'imt': Meta(data.response[i].metadata.imt),
    //       'vs30': Meta(data.response[i].metadata.site)
    //       });
    //   analysisCollection.add(analysis);
    // }
    AnalysisCollectionView({
      el: document.querySelector('#example'),
      analysisCollection: analysisCollection
    });
  }
});
