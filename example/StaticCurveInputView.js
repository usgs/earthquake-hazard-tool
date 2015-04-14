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
  output.innerHTML = JSON.stringify(analysis.toJSON(), null, 2);
};

_onParamsReady = function (params) {
  analysis.set({
    edition: Meta(params.edition.values[0]),
    region: Region(params.region.values[0]),
    imt: Meta(params.imt.values[0]),
    vs30: Meta(params.vs30.values[0])
  });

  analysis.on('change', _onCalcComplete);
};

_onShowButtonClick = function () {
  view.show(analysis);
};

calculator.getParameters('staticcurve', _onParamsReady);

button.addEventListener('click', _onShowButtonClick);
