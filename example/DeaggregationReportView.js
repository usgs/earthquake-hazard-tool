'use strict';

var Analysis = require('Analysis'),
    DeaggregationReportView = require('DeaggregationReportView'),
    DeaggResponse = require('deagg/DeaggResponse'),
    DependencyFactory = require('DependencyFactory'),

    Collection = require('mvc/Collection'),
    Xhr = require('util/Xhr');

var data = Xhr.ajax({
  url: 'deagg.json',
  success: function (data) {

    var dependencyFactory = DependencyFactory.getInstance();

    dependencyFactory.whenReady(function () {
      var analyses = Collection();
      var analysis = Analysis({
        'location': {
          'latitude': 34,
          'longitude': -118
        },
        'region': 'COUS0P05',
        'deaggregation': Collection(data.response.map(DeaggResponse))
      });

      // triggers Xhr, which populates _services in the dependencyFactory
      analysis.getEdition();

      analyses.add(analysis);
      analyses.select(analysis);

      DeaggregationReportView({
        el: document.querySelector('#example'),
        collection: analyses
      });
    });

  },
  error: function (e) {
    console.log('XHR error: ' + e);
  }
})

