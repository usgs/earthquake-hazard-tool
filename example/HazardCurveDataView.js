'use strict';

var Analysis = require('Analysis'),
    HazardCurveDataView = require('HazardCurveDataView'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'data.json',
  success: function (data) {
    HazardCurveDataView({
      el: document.querySelector('#example'),
      sites: data.response
    });
  }
});
