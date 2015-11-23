'use strict';

var Analysis = require('Analysis'),
    Collection = require('mvc/Collection'),
    LocationInfoView = require('LocationInfoView'),
    Data = require('curve/data');

var latitude = Data.response[0].metadata.latitude,
    longitude = Data.response[0].metadata.longitude;

var analyses,
    collection;

analyses = [];

analyses.push(Analysis({
  location: {
    latitude: latitude,
    longitude: longitude
  }
}));

collection = Collection(analyses);
collection.select(analyses[0]);

LocationInfoView({
  el: document.querySelector('.locationInfoView'),
  latitude: latitude,
  longitude: longitude,
  collection: collection
});
