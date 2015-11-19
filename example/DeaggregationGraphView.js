'use strict';


var DeaggregationGraphView = require('deagg/DeaggregationGraphView'),
    DeaggResponse = require('deagg/DeaggResponse'),
    rawResponse = require('deagg/data').response[0];


var collection,
    response,
    view;

response = DeaggResponse(rawResponse);
collection = response.get('deaggregations');
if (collection.getSelected() === null) {
  collection.select(collection.data()[0]);
}

view = DeaggregationGraphView({
  el: document.querySelector('#example'),
  collection: collection
});
view.render();
