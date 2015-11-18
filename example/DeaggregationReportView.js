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
    var collection,
        deaggregations,
        dependencyFactory,
        response;

    dependencyFactory = DependencyFactory.getInstance();
    response = DeaggResponse(data.response[0]);
    collection = response.get('deaggregations');
    collection.select(collection.data()[0]);

    dependencyFactory.whenReady(function () {
      var analysis = Analysis({
        'edition': 'E2014R1',
        'imt': 'PGA',
        'location': {
          'latitude': 34,
          'longitude': -118
        },
        'region': 'COUS0P05',
        'timeHorizon': 2475,
        'vs30': '760'
      });

      // triggers Xhr, which populates _services in the dependencyFactory
      analysis.getEdition();

      DeaggregationReportView({
        el: document.querySelector('#example'),
        collection: collection,
        analysis: analysis
      });
    });

  },
  error: function (e) {
    console.log('XHR error: ' + e);
  }
})

