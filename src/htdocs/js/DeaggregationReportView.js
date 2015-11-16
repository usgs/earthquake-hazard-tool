'use strict';

var SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Formatter = require('util/Formatter'),

    Util = require('util/Util');

var _RETURN_CHARACTERS;

_RETURN_CHARACTERS = '\r\n';

var DeaggregationReportView = function (params) {
  var _this,
      _initialize,

      _response,
      _summaries,

      _buildDeaggregationHeader,
      _buildDeaggregationMetadata,
      _buildDeaggregationPrincipalSources,
      _buildDeaggregationSummaryStatistics,
      _buildDeaggregationTableBody,
      _buildDeaggregationTableHeader,
      _checkDeaggregationSummary,
      _sumValues;

  _this = SelectedCollectionView(params);

  _initialize = function () {
    _this.el.classList.add('deaggregation-report-view');
    _summaries = {};
    _this.render();
  };

  _buildDeaggregationHeader = function (component) {
    return '#This deaggregation corresponds to: ' + component;
  };

  _buildDeaggregationMetadata = function () {
    var output;

    output = [];
    output.push(
      'PSHA Deaggregation. %contributions.',
      'site: Test',
      'longitude: ' + Formatter.longitude(_this.model.get('location').longitude),
      'latitude: ' + Formatter.longitude(_this.model.get('location').latitude),
      'imt: ' + _this.model.getSpectralPeriod().get('display'),
      'vs30 = ' + _this.model.getVs30().get('display') +
          ' (some WUS atten. models use Site Class not Vs30).',
      'return period: ' + _this.model.get('timeHorizon') + ' yrs.',
      'NSHMP 2007-08 See USGS OFR 2008-1128. dM=0.2 below'
    );

    return output.join(_RETURN_CHARACTERS);
  };

  _buildDeaggregationPrincipalSources = function (sources) {
    var output,
        source;

    output = [];
    output.push('Principal Sources (faults, subduction, random seismicity ' +
        'having > 3% contribution');

    for (var i = 0; i < sources.length; i++) {
      source = sources[i];

      if (source.azimuth === null) {
        output.push(
          source.name + ': ',
          '  Percent Contributed: ' + source.contribution,
          '  Distance (km): ' + source.r,
          '  Magnitude: ' + source.m,
          '  Epsilon (mean values): ' + source.ε
        );
      } else {
        output.push(
          source.name + ': ',
          '  Percent Contributed: ' + source.contribution,
          '  Distance (km): ' + source.r,
          '  Magnitude: ' + source.m,
          '  Epsilon (mean values): ' + source.ε,
          '  Azimuth: ' + source.azimuth,
          '  Latitude: ' + source.latitude,
          '  Longitude: ' + source.longitude
        );
      }
    }

    return output.join(_RETURN_CHARACTERS);
  };

  _buildDeaggregationSummaryStatistics = function (summaries) {
    var data,
        output,
        summary;

    output = ['Summary statistics for above PSHA PGA deaggregation, r=distance, ε=epsilon:'];

    for (var i = 0; i < summaries.length; i++) {
      summary = summaries[i];
      data = summary.data;
      // if data has no name it does not belong in summary seciton
      if (data[0] && data[0].name === null) {
        continue;
      }
      output.push(summary.name + ': ');

      for (var x = 0; x < data.length; x++) {
        if (data[x].name !== null) {
          output.push(
            '  ' + data[x].name + ': ' + data[x].value +
              (data[x].units ? ' ' + data[x].units : '')
          );
        }
      }
    }

    return output.join(_RETURN_CHARACTERS);
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
      output.push(row.join('\t'));
    }

    // join with line endings (CR LF)
    return output.join(_RETURN_CHARACTERS);
  };

  _buildDeaggregationTableHeader = function () {
    var output,
        ebins,
        min,
        max;

    ebins = _response.get('εbins');
    output = [];
    output.push( _response.get('rlabel') + '\t' + _response.get('mlabel') + '\tALL_ε');

    for (var i = (ebins.length - 1); i >= 0; i--) {
      min = (ebins[i].min ? ebins[i].min + '<' : '');
      max = (ebins[i].max ? '<' + ebins[i].max : '');
      output.push(min + 'ε' + max);
    }

    return output.join('\t');
  };

  _checkDeaggregationSummary = function (summary) {
    var output,
        data;

    output = [];

    for (var i = 0; i < summary.length; i++) {
      data = summary[i].data;
      // if data has no name it does not belong in summary seciton
      if (data[0] && data[0].name === null && data[0].value !== null) {
        output.push(summary[i].name + ': ' + data[0].value +
            (data[0].units ? ' ' + data[0].units : ''));
      }
    }

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

  _this.getDeaggregationReportSummary = function (component) {
    var deaggregations;

    // return summary if it exists
    if (_summaries && component && _summaries.hasOwnProperty('component')) {
      return _summaries[component];
    }

    // build _summaries
    deaggregations = _response.get('deaggregations').data();

    // Loop over deaggregations in the deaggregation response
    for (var i = 0; i < deaggregations.length; i++) {
      _summaries[deaggregations[i].get('component')] =
          deaggregations[i].get('summary');
    }

    return _summaries;
  };

  _this.getDeaggregationSummaryStatisticsHtml = function (component) {
    var output,
        summary,
        data;

    output = [];
    summary = _this.getDeaggregationReportSummary(component);

    if (summary === null) {
      return '';
    }

    // Loop over array of values in summary object
    for (var key in summary) {
      output.push('<h3>Summary statistics for, Deaggregation: ',key,'</h3>');

      for (var i = 0; i < summary[key].length; i++) {
        data = summary[key][i].data;

        if (summary[key][i].display === false) {
          // skip
          continue;
        }

        output.push('<h4>', summary[key][i].name, '</h4><dl class="summary">');

        for (var x = 0; x < data.length; x++) {
          output.push(
            '<dt>', data[x].name + '</dt>' +
            '<dd>' + data[x].value +
                (data[x].units ? ' ' + data[x].units : '') + '</dd>'
          );
        }

        output.push('</dl>');
      }

    }

    return output.join('');
  };

  _this.getDeaggregationReport = function () {
    var deaggregations,
        output;

    deaggregations = _response.get('deaggregations').data();
    output = [
      '*** Deaggregation of Seismic Hazard at One Period of Spectral Accel. ***',
      //'*** Data from TODO ****'
      '*** Data from ' + _this.model.getEdition().get('display') + ' ****'
    ];

    // Loop over deaggregations in the deaggregation response
    for (var i = 0; i < deaggregations.length; i++) {
      output.push(
        _buildDeaggregationMetadata(),
        _checkDeaggregationSummary(deaggregations[i].get('summary')),
        _buildDeaggregationHeader(deaggregations[i].get('component')),
        _buildDeaggregationSummaryStatistics(deaggregations[i].get('summary')),
        _buildDeaggregationTableHeader(deaggregations[i].get('data')),
        _buildDeaggregationTableBody(deaggregations[i].get('data')),
        _buildDeaggregationPrincipalSources(deaggregations[i].get('sources'))
      );
    }

    return output.join(_RETURN_CHARACTERS);
  };


  _this.destroy = Util.compose(function () {
    _buildDeaggregationHeader = null;
    _buildDeaggregationMetadata = null;
    _buildDeaggregationPrincipalSources = null;
    _buildDeaggregationSummaryStatistics = null;
    _buildDeaggregationTableBody = null;
    _buildDeaggregationTableHeader = null;
    _checkDeaggregationSummary = null;
    _sumValues = null;

    _response = null;

    _initialize = null;
    _this =  null;
  }, _this.destroy);


  _this.render = function () {
    var responses;

    if (_this.model === null || _this.model.get('deaggregation') === null) {
      _this.el.innerHTML = '';
      return;
    }

    // set _response equal to the DeaggResponse that matches the imt
    // of the currently selected analysis model
    responses = _this.model.get('deaggregation').data();
    for (var i = 0; i < responses.length; i++) {
      if (responses[i].get('imt') === _this.model.get('imt')) {
        _response = responses[i];
        break;
      }
    }

    _this.getDeaggregationReportSummary('Total');
    _this.el.innerHTML = _this.getDeaggregationSummaryStatisticsHtml() +
        '<a href="data:text/plain;charset=UTF-8,' +
          encodeURIComponent(_this.getDeaggregationReport()) +
        '">Click to Download Deaggregation Report</a>';
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = DeaggregationReportView;