'use strict';

var Analysis = require('Analysis'),
    Calculator = require('Calculator'),
    Meta = require('Meta'),
    Region = require('Region'),
    StaticCurveInputView = require('StaticCurveInputView');


var analysis,
    button,
    calculator,
    output,
    view,

    _onCalcComplete,
    _onParamsReady,
    _onShowButtonClick;


analysis = Analysis({latitude: 35.0, longitude: -118.0});
button = document.querySelector('#showView');
calculator = Calculator();
output = document.querySelector('#output');
view = StaticCurveInputView({
  calculator: calculator
});


_onCalcComplete = function () {
  var curve = analysis.get('staticcurve');

  if (curve !== null) {
    curve = '<dt>Result</dt><dd>' +
        JSON.stringify(curve.get('curves').data()[0].get('data')) + '</dd>';
  } else {
    curve = '';
  }

  output.innerHTML = [
    '<dl>',
      '<dt>Edition</dt>',
      '<dd>', analysis.get('edition').get('display'), '</dd>',
      '<dt>Region</dt>',
      '<dd>', analysis.get('region').get('display'), '</dd>',
      '<dt>Location</dt>',
      '<dd>(',
        analysis.get('latitude'), ', ', analysis.get('longitude'),
      ')</dd>',
      '<dt>IMT</dt>',
      '<dd>', analysis.get('imt').get('display'), '</dd>',
      '<dt>Vs30</dt>',
      '<dd>', analysis.get('vs30').get('display'), '</dd>',
      curve,
    '</dl>'
  ].join('');
};

_onParamsReady = function (params) {
  analysis.set({
    edition: Meta(params.edition.values[0]),
    region: Region(params.region.values[0]),
    imt: Meta(params.imt.values[0]),
    vs30: Meta(params.vs30.values[0])
  });

  analysis.on('change', _onCalcComplete);
  _onCalcComplete();
};

_onShowButtonClick = function () {
  view.show(analysis);
};

calculator.getParameters('staticcurve', _onParamsReady);

button.addEventListener('click', _onShowButtonClick);
