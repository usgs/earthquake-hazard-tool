'use strict';

var Analysis = require('Analysis'),
    SiteClassView = require('SiteClassView'),
    Meta = require('Meta'),
    Region = require('Region'),

    Collection = require('mvc/Collection');

var metadata = require('etc/metadata');

var analyses = [],
    buttonChange,
    buttonDeselect,
    collection,
    edition,
    imt,
    region,
    vs30 = [],
    vs30;


var toggleSelectedCalculation = function () {
  if (collection.getSelected() === collection.data()[0]) {
    collection.select(collection.data()[1]);
  } else {
    collection.select(collection.data()[0]);
  }
};

var deselectAnalysis = function () {
  if (collection.getSelected()) {
    collection.deselect();
  }
};

// Button bindings
buttonChange = document.querySelector('.change-selected');
buttonChange.addEventListener('click', toggleSelectedCalculation);

buttonDeselect = document.querySelector('.remove-selected');
buttonDeselect.addEventListener('click', deselectAnalysis);

// Build array of siteClass models
metadata.parameters.vs30.values.map(function(siteClass) {
  vs30.push(Meta(siteClass));
});

edition = Meta(metadata.parameters.edition.values[0]);
region = Region(metadata.parameters.region.values[0]);
imt = Meta(metadata.parameters.imt.values[0]);

// build array of analysis models for the collection
analyses.push(Analysis({
  edition: edition,
  region: region,

  longitude: -116,
  latitude: 35,

  imt: imt,
  vs30: vs30[1]
}));

analyses.push(Analysis({
  edition: edition,
  region: region,

  longitude: -105,
  latitude: 40,

  imt: imt,
  vs30: vs30[2]
}));

// select the first item in the collection 
collection = Collection(analyses);
collection.select(analyses[0]);

// build the siteClass view
SiteClassView({
  el: document.getElementById('example'),
  vs30: Collection(vs30),
  collection: collection
});
