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
    edition: 'E2008R3',
    vs30: '760',
    timeHorizon: 2475,
  });

  analysis.on('change:staticcurves', function () {
    console.log(analysis.get('staticcurves').toJSON());
  });

  analyses = Collection([analysis]);

  ApplicationView({
    collection: analyses,
    dependencyFactory: dependencyFactory,
    el: document.querySelector('.application')
  });

  analyses.select(analysis);

  // TODO :: remove this ...
  window.model = analysis;
  analysis.on('change:curves', function () {
    document.querySelector('.tmp-output').innerHTML =
        JSON.stringify(analysis.toJSON(), null, 2);
  });
});
