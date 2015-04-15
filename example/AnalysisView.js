'use strict';

var Analysis = require('Analysis'),
    AnalysisView = require('AnalysisView'),
    Meta = require('Meta'),
    Region = require('Region'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'data.json',
  success: function (data) {
    var analysis = new Analysis();
    analysis.set({'id': 1,
          'latitude': data.response[0].metadata.latitude,
          'longitude': data.response[0].metadata.longitude,
          'edition': Meta(data.response[0].metadata.edition),
          'region': Region(data.response[0].metadata.region),
          'imt': Meta(data.response[0].metadata.imt),
          'vs30': Meta(data.response[0].metadata.site)
          });
    AnalysisView({
      container: document.querySelector('#examplelist'),
      analysis: analysis,
      name: 'analysis-1'
    });
  }
});
