'use strict';

var Analysis = require('Analysis'),
    TimeHorizonInputView = require('TimeHorizonInputView'),
    Collection = require('mvc/Collection');

var analyses = Collection();
var analysis = Analysis({
  timeHorizon: 12345678
});

analyses.add(analysis);

TimeHorizonInputView({
  el: document.querySelector('.timeHorizonView'),
  collection: analyses
});

analyses.select(analysis);