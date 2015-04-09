'use strict';

var HazardCurve = require('HazardCurve'),
    HazardCurveGraphView = require('HazardCurveGraphView'),
    Xhr = require('util/Xhr');


Xhr.ajax({
  url: 'data.json',
  success: function (data) {
    HazardCurveGraphView({
      el: document.querySelector('#example'),
      curve: HazardCurve(data.response[0])
    });
  }
});
