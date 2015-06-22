'use strict';

var Analysis = require('Analysis'),
    ContourTypeView = require('ContourTypeView'),
    Collection = require('mvc/Collection'),
    Meta = require('Meta'),
    metadata = require('etc/metadata');

var analyses,
    contourTypes,
    collection;

analyses = [];
contourTypes = [];

metadata.parameters.contourType.values.map(function (contourType) {
  contourTypes.push(Meta(contourType));
});

analyses.push(Analysis({
  contourType: contourTypes[0]
}));

analyses.push(Analysis({
  contourType: contourTypes[1]
}));
collection = Collection(analyses);
collection.select(analyses[1]);

ContourTypeView({
  el: document.querySelector('.contourType'),
  contourType: Collection(contourTypes),
  collection: collection
});
