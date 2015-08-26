'use strict';

var Analysis = require('Analysis'),
    Collection = require('mvc/Collection'),
    DataExport = require('DataExport'),
    DependencyFactory = require('DependencyFactory'),
    HazardResponse = require('HazardResponse');

var data = require('etc/data');

DependencyFactory.getInstance().whenReady(function () {
  var collection,
      analysis;

  collection = Collection();
  analysis = Analysis({
    'id': 1,
    'location': {
      'latitude': data.response[0].metadata.latitude,
      'longitude': data.response[0].metadata.longitude
    },
    'curves': HazardResponse(data.response),
    'edition': data.response[0].metadata.edition.value,
    'region': data.response[0].metadata.region.value,
    'imt': data.response[0].metadata.imt.value,
    'vs30': data.response[0].metadata.vs30.value
  });

  collection.add(analysis);
  collection.select(analysis);

  DataExport({
    el: document.querySelector('.example'),
    collection: collection
  });
});
