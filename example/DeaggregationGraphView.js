'use strict';


var Collection = require('mvc/Collection'),
    DeaggregationGraphView = require('deagg/DeaggregationGraphView'),
    DeaggResponse = require('deagg/DeaggResponse'),
    rawResponse = require('etc/deagg').response[0];


var collection,
    response,
    view;

response = DeaggResponse(rawResponse);
collection = Collection();
collection.add(response);
collection.select(response);

view = DeaggregationGraphView({
  el: document.querySelector('#example'),
  collection: collection
});
view.render();
