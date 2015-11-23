'use strict';

var Analysis = require('Analysis'),
    AnalysisView = require('AnalysisView'),
    DependencyFactory = require('DependencyFactory'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'curve/data.json',
  success: function (data) {
    DependencyFactory.getInstance().whenReady(function () {
      AnalysisView({
        el: document.querySelector('#example'),
        model: Analysis({
          'id': 1,
          'location': {
            'latitude': data.response[0].metadata.latitude,
            'longitude': data.response[0].metadata.longitude
          },
          'edition': data.response[0].metadata.edition.value,
          'region': data.response[0].metadata.region.value,
          'imt': data.response[0].metadata.imt.value,
          'vs30': data.response[0].metadata.vs30.value
        })
      });
    });
  }
});
