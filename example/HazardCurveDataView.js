'use strict';

var HazardCurveDataView = require('HazardCurveDataView'),
    HazardResponse = require('HazardResponse'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'data.json',
  success: function (data) {
    var curves = HazardResponse(data.response[0]).get('curves');

    HazardCurveDataView({
      el: document.querySelector('#example'),
      collection: curves
    });
  }
});
