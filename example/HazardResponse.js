'use strict';

var Calculator = require('Calculator');

var calculator,
    inputParams,

    onClearClick,
    onResponse,
    onSubmitClick;

    calculator = Calculator();
    inputParams = {
      edition: 'E2008R3',
      region: 'COUS0P05',
      longitude: -118.000,
      latitude: 35.000,
      imt: 'PGA',
      vs30: '760'
    };


onClearClick = function () {
  output.innerHTML = '';
};

onResponse = function (response) {
  output.innerHTML = JSON.stringify(response, null, 2);
};

onSubmitClick = function () {
  calculator.getResult('staticcurve', inputParams, onResponse);
};

document.querySelector('#submit').addEventListener('click', onSubmitClick);
