'use strict';

var SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Formatter = require('util/Formatter'),

    Util = require('util/Util');

var _RETURN_CHARACTERS;

_RETURN_CHARACTERS = '&#13;&#10;';

var DeaggregationReportView = function (params) {
  var _this,
      _initialize,

      _response,
      _deaggregations,

      _buildDeaggregationHeader,
      _buildDeaggregationMetadata,
      _buildDeaggregationPrincipalSources,
      _buildDeaggregationTableBody,
      _buildDeaggregationTableHeader,
      _sumValues;

  _this = SelectedCollectionView(params);

  _initialize = function () {
    _this.render();
  };


  _buildDeaggregationHeader = function (component) {
    return '#This deaggregation corresponds to ' + component;
  };

  _buildDeaggregationPrincipalSources = function (sources) {
    var output,
        source;

    output = [];
    output.push('Principal Sources (faults, subduction, random seismicity ' +
        'having &gt; 3% contribution');

    for (var i = 0; i < sources.length; i++) {
      source = sources[i];

      if (source.azimuth === null) {
        output.push(
          source.name,
          'Percent Contributed,' + source.contribution,
          'Distance (km),' + source.rBar,
          'Magnitude,' + source.mBar,
          'Epsilon (mean values),' + source.εBar
        );
      } else {
        output.push(
          source.name,
          'Percent Contributed,' + source.contribution,
          'Distance (km),' + source.r,
          'Magnitude,' + source.m,
          'Epsilon (mean values),' + source.ε
        );
      }
    }

    return output.join(_RETURN_CHARACTERS);
  };

  _buildDeaggregationTableHeader = function () {
    var output,
        ebins,
        min,
        max;

    ebins = _response.get('εbins');
    output = [];
    output.push( _response.get('rlabel') + ',' + _response.get('mlabel') + ',ALL_EPS');

    for (var i = (ebins.length - 1); i >= 0; i--) {
      min = (ebins[i].min ? ebins[i].min + '&lt;' : '');
      max = (ebins[i].max ? '&lt;' + ebins[i].max : '');
      output.push(min + 'EPS' + max);
    }

    return output.join(',') + _RETURN_CHARACTERS;
  };

  _buildDeaggregationTableBody = function (data) {
    var output,
        row,
        edata;

    output = [];

    for (var i = (data.length - 1); i >= 0; i--) {
      edata = data[i].εdata;
      row = [];

      // distance, magnitude, and mean values
      row.push(data[i].r, data[i].m, _sumValues(data[i].εdata));

      // edata values
      for (var x = 0; x < _response.get('εbins').length; x++) {
        row.push(edata[x] ? edata[x].value.toFixed(3) : (0.000).toFixed(3));
      }

      // add row to output
      output.push(row.join(','));
    }

    // join with line endings (CR LF)
    return output.join(_RETURN_CHARACTERS);
  };

  _sumValues = function (values) {
    var total;

    total = 0;

    for (var i = 0; i < values.length; i++) {
      total += values[i].value;
    }

    return (total / values.length).toFixed(3);
  };


  _this.getResponseSummary = function () {
    var output;

    if (_this.model === null) {
      return '';
    }

    output = 'TODO::waiting on updates to feed';

    return output;
  };

  _buildDeaggregationMetadata = function () {
    var output;

    output = [];

    output.push(
      'PSHA Deaggregation. %contributions.',
      'site: Test',
      'longitude: ' + Formatter.longitude(_this.model.get('location').longitude),
      'latitude: ' + Formatter.longitude(_this.model.get('location').latitude),
      'Vs30 = ' + _this.model.get('vs30') +
          ' (some WUS atten. models use Site Class not Vs30).',
      'NSHMP 2007-08 See USGS OFR 2008-1128. dM=0.2 below',
      'Return period: ' + _this.model.get('timeHorizon') + ' yrs.',
      'Exceedance PGA = 0.8928 g.',
      'Weight * Computed_Rate_Ex 0.407E-03',
      '#Pr [at least one eq with median motion >= PGA in 50 yrs] = 0.00048'
    );

    return output.join(_RETURN_CHARACTERS);
  };

  _this.getDeaggregationTables = function () {
    var output;

    output = [];
    _deaggregations = _response.get('deaggregations').data();

    for (var i = 0; i < _deaggregations.length; i++) {
      output.push(
        _buildDeaggregationMetadata(),
        _buildDeaggregationHeader(_deaggregations[i].get('component')),
        _buildDeaggregationTableHeader(_deaggregations[i].get('data')),
        _buildDeaggregationTableBody(_deaggregations[i].get('data')),
        _buildDeaggregationPrincipalSources(_deaggregations[i].get('sources'))
      );
    }

    return output.join(_RETURN_CHARACTERS);
  };


  _this.destroy = Util.compose(function () {
    _buildDeaggregationHeader = null;
    _buildDeaggregationMetadata = null;
    _buildDeaggregationPrincipalSources = null;
    _buildDeaggregationTableBody = null;
    _buildDeaggregationTableHeader = null;
    _sumValues = null;

    _response = null;

    _initialize = null;
    _this =  null;
  }, _this.destroy);


  _this.render = function () {
    var output,
        responses;

    if (_this.model === null) {
      _this.el.innerHTML = '';
      return;
    }

    // get the deaggResponse that matches the imt of the currently
    // selected analysis model
    responses = _this.model.get('deaggregation').data();
    for (var i = 0; i < responses.length; i++) {
      if (responses[i].get('imt') === _this.model.get('imt')) {
        _response = responses[i];
      }
    }

    // build report output
    output = [
        '*** Deaggregation of Seismic Hazard at One Period of Spectral Accel. ***',
        '*** Data from ', /*_this.model.getEdition().get('display'),*/ ' ****',
        //_this.getResponseSummary(),
        _this.getDeaggregationTables()
    ];

    _this.el.innerHTML = output.join(_RETURN_CHARACTERS);
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = DeaggregationReportView;