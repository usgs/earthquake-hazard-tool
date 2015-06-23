'use strict';

var Analysis = require('Analysis'),
    TimeHorizonSliderView = require('TimeHorizonSliderView'),

    Collection = require('mvc/Collection');

var analyses = [],
    buttonChange,
    buttonDeselect,
    collection;

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

// build array of analysis models for the collection
analyses.push(Analysis({
  timeHorizon: 475
}));

analyses.push(Analysis({
  timeHorizon: 2475
}));

// select the first item in the collection 
collection = Collection(analyses);
collection.select(analyses[1]);

// build the TimeHorizonSliderView
TimeHorizonSliderView({
  el: document.getElementById('example'),
  collection: collection
});