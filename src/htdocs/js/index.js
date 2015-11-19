/* global CURVE_SERVICES, DEAGG_SERVICES */
'use strict';

var Analysis = require('Analysis'),
    ApplicationView = require('ApplicationView'),
    DependencyFactory = require('DependencyFactory'),

    Collection = require('mvc/Collection'),

    Util = require('util/Util');

Util.detach(document.querySelector('noscript'));

var analyses,
    analysis,
    dependencyFactory,
    serviceConfig;

serviceConfig = {};
serviceConfig[DependencyFactory.TYPE_CURVE] = CURVE_SERVICES;
serviceConfig[DependencyFactory.TYPE_DEAGG] = DEAGG_SERVICES;


dependencyFactory = DependencyFactory.getInstance({
  services: serviceConfig
});

dependencyFactory.whenReady(function () {
  analysis = Analysis();

  analyses = Collection([analysis]);

  ApplicationView({
    collection: analyses,
    dependencyFactory: dependencyFactory,
    el: document.querySelector('.application')
  });

  analyses.select(analysis);
});
