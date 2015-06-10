'use strict';

var Analysis = require('Analysis'),
    EditionView = require('EditionView'),
    Meta = require('Meta'),
    Region = require('Region'),

    Collection = require('mvc/Collection');

var metadata = require('etc/metadata');

var analyses = [],
    button,
    collection,
    editions = [],
    imt,
    region,
    vs30;

var toggleSelectedCalculation = function () {
  if (collection.getSelected() === analyses[0]) {
    collection.select(analyses[1]);
  } else {
    collection.select(analyses[0]);
  }
};


button = document.querySelector('.change-selected');
button.addEventListener('click', toggleSelectedCalculation);

// build array of edition models
metadata.parameters.edition.values.map(function(edition) {
  editions.push(Meta(edition));
});

region = Region(metadata.parameters.region.values[0]);
imt = Meta(metadata.parameters.imt.values[0]);
vs30 = Meta(metadata.parameters.vs30.values[0]);

// build array of analysis models for the collection
analyses.push(Analysis({
  edition: editions[0],
  region: region,

  longitude: -120,
  latitude: 35,

  imt: imt,
  vs30: vs30
}));

analyses.push(Analysis({
  edition: editions[1],
  region: region,

  longitude: -105,
  latitude: 40,

  imt: imt,
  vs30: vs30
}));

// select the first item in the collection 
collection = Collection(analyses);
collection.select(analyses[0]);

// build the edition view
EditionView({
  el: document.getElementById('example'),
  editions: Collection(editions),
  collection: collection
});


