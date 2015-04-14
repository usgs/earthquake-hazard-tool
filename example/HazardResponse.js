'use strict';

var Analysis = require('Analysis'),
    Calculator = require('Calculator'),
    Meta = require('Meta'),
    Region = require('Region'),

    metadata = require('etc/metadata');

var calculator,
    inputParams,

    onClearClick,
    onResponse,
    onSubmitClick;

    calculator = Calculator();
    inputParams = Analysis({
      edition: Meta(metadata.parameters.edition.values[0]),
      region: Region(metadata.parameters.region.values[0]),
      longitude: -118.000,
      latitude: 35.000,
      imt: Meta(metadata.parameters.imt.values[0]),
      vs30: Meta(metadata.parameters.vs30.values[0])
    });


onClearClick = function () {
  output.innerHTML = '';
};

onResponse = function (response) {
  output.innerHTML = JSON.stringify(response.result, null, 2);
};

onSubmitClick = function () {
  calculator.getResult('staticcurve', inputParams, onResponse);
};

document.querySelector('#submit').addEventListener('click', onSubmitClick);
