'use strict';

var d3 = require('d3'),
    HazardCurve = require('HazardCurve'),
    HazardCurveGraphView = require('HazardCurveGraphView'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var el,
    view;

el = document.querySelector('#example');
el.innerHTML = '<div class="graph"></div>' +
    '<div class="controls"></div>';

// create view
view = HazardCurveGraphView({
  el: el.querySelector('.graph'),
  title: 'Example HazardCurveGraphView',
  xAxisLabel: 'Ground Motion (g)',
  yAxisLabel: 'Annual Frequency of Exceedence'
});

// example of selected curve
view.curves.on('select', function (curve) {
  console.log('selected curve');
  console.log(curve.get());
});

// load curves
Xhr.ajax({
  url: 'data.json',
  success: function (data) {
    view.curves.reset(
      data.response.map(function (d, index) {
        return HazardCurve(Util.extend({},
          d.metadata,
          {
            id: index,
            yvals: d.data
          }
        ));
      })
    );
  }
});
