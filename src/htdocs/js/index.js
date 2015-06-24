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
  url: '/hazws/staticcurve/1/'
});

dependencyFactory.whenReady(function () {
  analysis = Analysis({
    edition: dependencyFactory.getEdition('E2008R3'),
    vs30: dependencyFactory.getSiteClass('760'),
    timeHorizon: 2475,
  });

  analyses = Collection([analysis]);
  analyses.select(analysis);

  ApplicationView({
    collection: analyses,
    el: document.querySelector('.application')
  });
});
