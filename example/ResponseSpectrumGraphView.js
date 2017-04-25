'use strict';

var Collection = require('mvc/Collection'),
    HazardResponse = require('HazardResponse'),
    ResponseSpectrumGraphView = require('ResponseSpectrumGraphView'),
    Xhr = require('util/Xhr');


var curvesCollection,
    el,
    view;

el = document.querySelector('#example');
el.innerHTML = '<div class="graph"></div>' +
    '<div class="controls"></div>';

curvesCollection = Collection([]);

// create view
view = ResponseSpectrumGraphView({
  curves: curvesCollection,
  el: el.querySelector('.graph'),
  title: 'Example ResponseSpectrumGraphView',
  xAxisLabel: 'Period',
  yAxisLabel: 'Ground Motion (g)',
  width: 640,
  height: 400,
  paddingLeft: 70,
  paddingRight: 16,
  paddingTop: 30,
  timeHorizon: 2475
});

// example of selected curve
curvesCollection.on('select', function (curve) {
  console.log('selected curve');
  console.log(curve.get());
});

// load curves
Xhr.ajax({
  url: '/curve/data.json',
  success: function (data) {
    var curves = [];
    var i = 0;
    var response = HazardResponse(data.response);

    response.get('curves').data().forEach(function (c) {
      c.set({'period': ++i});
      curves.push(c);
    });

    view.model.set({
      xAxisLabel: response.get('xlabel'),
      yAxisLabel: response.get('ylabel')
    });

    curvesCollection.reset(curves);
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
