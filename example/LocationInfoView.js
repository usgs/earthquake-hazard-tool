'use strict';

var LocationInfoView = require('LocationInfoView'),
    Data = require('etc/data');

var latitude = Data.response[0].metadata.latitude,
    longitude = Data.response[0].metadata.longitude;

LocationInfoView({
  el: document.querySelector('.locationInfoView'),
  latitude: latitude,
  longitude: longitude
});