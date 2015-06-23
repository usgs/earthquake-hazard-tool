'use strict';

var ApplicationView = require('ApplicationView'),
    DependencyFactory = require('DependencyFactory'),

    Util = require('util/Util');

Util.detach(document.querySelector('noscript'));

DependencyFactory.getInstance({url: '/hazws/staticcurve/1/'}).whenReady(
  function () {
    ApplicationView({
      el: document.querySelector('.application')
    });
  }
);
