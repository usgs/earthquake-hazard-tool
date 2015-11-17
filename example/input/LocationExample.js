'use strict';

var Location = require('input/Location'),

    Model = require('mvc/Model');


var locationInput,
    logger,
    model;

model = Model();
logger = document.querySelector('.log-output');

model.on('change', function () {
  var p,
      child;

  p = document.createElement('p');
  p.innerHTML = 'Model = ' + JSON.stringify(model.get(), null, '  ');

  child = logger.firstChild;
  if (child) {
    logger.insertBefore(p, child);
  } else {
    logger.appendChild(p);
  }
});

locationInput = Location({
  el: document.querySelector('#example'),
  model: model
});
