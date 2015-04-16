'use strict';

var Analysis = require('Analysis'),
    HazardCurveDataView = require('HazardCurveDataView'),
    HazardResponse = require('HazardResponse'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'data.json',
  success: function (data) {
    var responses = data.response || [],
        response;

    response = data.response[0];

    HazardCurveDataView({
      el: document.querySelector('#example'),
      response: HazardResponse(response)
    });
  }
});
