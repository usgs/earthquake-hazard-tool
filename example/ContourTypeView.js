'use strict';

var Analysis = require('Analysis'),
    ContourTypeView = require('ContourTypeView'),
    Collection = require('mvc/Collection'),
    Meta = require('Meta'),
    metadata = require('etc/metadata');

var analyses,
    contourTypes;

analyses = Collection();
contourTypes = [];


metadata.parameters.contourType.values.map(function (contourType) {
  contourTypes.push(Meta(contourType));
});

analyses.add(Analysis({
  contourType: contourTypes[0]
}));

analyses.add(Analysis({
  contourType: contourTypes[1]
}));

ContourTypeView({
  el: document.querySelector('.contourType'),
  contourType: Collection(contourTypes),
  collection: analyses
});
