/* global WEB_SERVICES */
'use strict';

var Analysis = require('Analysis'),
    ApplicationView = require('ApplicationView'),
    DependencyFactory = require('DependencyFactory'),

    Collection = require('mvc/Collection'),

    Util = require('util/Util');

Util.detach(document.querySelector('noscript'));

var analyses,
    analysis,
    dependencyFactory;

dependencyFactory = DependencyFactory.getInstance({
  services: WEB_SERVICES
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
