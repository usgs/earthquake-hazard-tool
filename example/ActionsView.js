'use strict';

var Analysis = require('Analysis'),
    ActionsView = require('ActionsView'),
    Meta = require('Meta'),
    Region = require('Region'),

    Collection = require('mvc/Collection');

var metadata = require('etc/metadata');

var analyses = [],
    collection,
    region,
    imt,
    vs30;

region = Region(metadata.parameters.region.values[0]);
vs30 = Meta(metadata.parameters.vs30.values[0]);
imt = Meta(metadata.parameters.imt.values[0]);

// build array of analysis models for the collection
analyses.push(Analysis({
  edition: Meta(metadata.parameters.edition.values[0]),
  region: region,

  longitude: -116,
  latitude: 35,

  imt: imt,
  vs30: vs30
}));

analyses.push(Analysis({
  edition: Meta(metadata.parameters.edition.values[1]),
  region: region,

  longitude: -105,
  latitude: 40,

  imt: imt,
  vs30: vs30
}));

// build a collection of analyses
collection = Collection(analyses);

// build the actions view
ActionsView({
  el: document.getElementById('example'),
  collection: collection
});

// select the first item in the collection
collection.select(analyses[0]);