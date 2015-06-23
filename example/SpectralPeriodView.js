'use strict';

var Analysis = require('Analysis'),
    SpectralPeriodView = require('SpectralPeriodView'),
    Meta = require('Meta'),
    Region = require('Region'),

    Collection = require('mvc/Collection');

var metadata = require('etc/metadata');

var analyses = [],
    buttonChange,
    buttonDeselect,
    buttonLocation,
    collection,
    edition,
    region,
    imt = [],
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

var updateLocation = function () {
  var longitude,
      model = collection.getSelected();

  longitude = model.get('longitude');

  if (longitude > -115) {
    longitude = -116;
  } else {
    longitude = -114;
  }

  model.set({'longitude': longitude});
};

// Button bindings
buttonChange = document.querySelector('.change-selected');
buttonChange.addEventListener('click', toggleSelectedCalculation);

buttonDeselect = document.querySelector('.remove-selected');
buttonDeselect.addEventListener('click', deselectAnalysis);

buttonLocation = document.querySelector('.change-location');
buttonLocation.addEventListener('click', updateLocation);

// Build array of siteClass models
metadata.parameters.imt.values.map(function(spectralPeriod) {
  imt.push(Meta(spectralPeriod));
});

edition = Meta(metadata.parameters.edition.values[0]);
region = Region(metadata.parameters.region.values[0]);
vs30 = Meta(metadata.parameters.vs30.values[0]);

// build array of analysis models for the collection
analyses.push(Analysis({
  edition: edition,
  region: region,

  longitude: -116,
  latitude: 35,

  imt: imt[0],
  vs30: vs30
}));

analyses.push(Analysis({
  edition: edition,
  region: region,

  longitude: -105,
  latitude: 40,

  imt: imt[1],
  vs30: vs30
}));

// select the first item in the collection 
collection = Collection(analyses);
collection.select(analyses[0]);

// build the siteClass view
SpectralPeriodView({
  el: document.getElementById('example'),
  imt: Collection(imt),
  collection: collection
});
