'use strict';

var HazardResponse = require('HazardResponse'),
    HazardCurveGraphView = require('HazardCurveGraphView'),
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
  xLabel: 'Ground Motion (g)',
  yLabel: 'Annual Frequency of Exceedence',
  width: 640,
  height: 400,
  paddingLeft: 70,
  paddingRight: 16,
  paddingTop: 30
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
    var response = HazardResponse(data.response);
    view.curves.reset(response.get('curves').data());
  }
});



var div,
    range,
    value;

div = document.createElement('div');
div.innerHTML = '<label for="timeHorizon">Time Horizon</label>' +
    '<input type="range" id="timeHorizon" ' +
    ' value="' + view.model.get('timeHorizon') + '"' +
    ' min="3" max="5000" step=".1"/>' +
    '<span class="timeHorizonValue">' +
      view.model.get('timeHorizon') + ' years' +
    '</span>';
document.querySelector('body').appendChild(div);

range = div.querySelector('#timeHorizon');
value = div.querySelector('.timeHorizonValue');
range.addEventListener('input', function () {
  view.model.set({timeHorizon: range.value});
  value.innerHTML = range.value + ' years';
});
