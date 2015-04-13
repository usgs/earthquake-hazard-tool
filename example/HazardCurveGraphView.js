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
  title: 'Example HazardCurveGraphView'
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

// form to control scales
var xAxisLog,
    yAxisLog,
    setScales;

el.querySelector('.controls').innerHTML =
    '<form>' +
    '<label for="xAxisLog">' +
      '<input type="checkbox" id="xAxisLog" checked="checked"/>' +
      'X Axis Log' +
    '</label>' +
    '<label for="yAxisLog">' +
      '<input type="checkbox" id="yAxisLog" checked="checked"/>' +
      'Y Axis Log' +
    '</label>' +
    '</form>';

xAxisLog = el.querySelector('#xAxisLog');
yAxisLog = el.querySelector('#yAxisLog');

setScales = function () {
  view.setScales(
    xAxisLog.checked ? d3.scale.log() : d3.scale.linear(),
    yAxisLog.checked ? d3.scale.log() : d3.scale.linear()
  );
};

xAxisLog.addEventListener('change', setScales);
yAxisLog.addEventListener('change', setScales);

// initialize to form defaults
setScales();
