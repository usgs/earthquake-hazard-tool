'use strict';

var HazardCurveDataView = require('HazardCurveDataView'),
    HazardResponse = require('HazardResponse'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'data.json',
  success: function (data) {
    var response = data.response[0];

    HazardCurveDataView({
      el: document.querySelector('#example'),
      response: HazardResponse(response)
    });
  }
});
