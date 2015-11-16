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

      _calculateMean,
      _checkSummaryValues,
      _getHeader,
      _getMetadata,
      _getSources,
      _getSummary,
      _getTable,
      _getTableBody,
      _getTableHeader,
      _getTitle,
      _setSummaries;

  _this = SelectedCollectionView(params);


  _initialize = function () {
    _this.el.classList.add('deaggregation-report-view');
    _this.render();
  };


  /**
   * Get plain/text markup for the response metadata,
   * formatted with line endings
   */
  _getTitle = function () {
    return [
      '*** Deaggregation of Seismic Hazard at One Period of Spectral Accel. ***',
      '*** Data from ' + _this.model.getEdition().get('display') + ' ****'
    ].join(_RETURN_CHARACTERS);
  };


  /**
   * Get plain/text markup for the deaggregation header
   */
  _getHeader = function (component) {
    return '#This deaggregation corresponds to: ' + component;
  };


  /**
   * Get plain/text markup for the response metadata,
   * formatted with line endings
   */
  _getMetadata = function (summary) {
    var output,
        summaryMarkup;

    output = [];
    summaryMarkup = _checkSummaryValues(summary);

    output.push(
      'PSHA Deaggregation. %contributions.',
      'site: Test',
      'longitude: ' + Formatter.longitude(_this.model.get('location').longitude),
      'latitude: ' + Formatter.longitude(_this.model.get('location').latitude),
      'imt: ' + _this.model.getSpectralPeriod().get('display'),
      'vs30 = ' + _this.model.getVs30().get('display') +
          ' (some WUS atten. models use Site Class not Vs30).',
      'return period: ' + _this.model.get('timeHorizon') + ' yrs.'
    );

    if (summaryMarkup.length !== 0) {
      output.push(summaryMarkup.join(_RETURN_CHARACTERS));
    }

    output.push('NSHMP 2007-08 See USGS OFR 2008-1128. dM=0.2 below');

    return output.join(_RETURN_CHARACTERS);
  };


  /**
   * Get plain/text markup for the deaggregation soures data,
   * formatted with line endings
   */
  _getSources = function (sources) {
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


  /**
   * Get plain/text markup for the deaggregation summary data, 
   * formatted with line endings
   */
  _getSummary = function (summaries) {
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


  /**
   * Get plain/text markup for ebin table data
   */
  _getTable = function (data) {
    return [
      _getTableHeader(),
      _getTableBody(data)
    ].join();
  };


  /**
   * Get plain/text markup for the table body, formatted using tab delimiters
   */
  _getTableBody = function (data) {
    var output,
        row,
        edata;

    output = [];

    for (var i = (data.length - 1); i >= 0; i--) {
      edata = data[i].εdata;
      row = [];

      // distance, magnitude, and mean values
      row.push(data[i].r, data[i].m, _calculateMean(data[i].εdata));

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


  /**
   * Get plain/text markup for the table header, formatted using tab delimiters
   */
  _getTableHeader = function () {
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


  /**
   * Parse through deaggregation summary values to see if any values should be
   * added to the metadata section.
   */
  _checkSummaryValues = function (summary) {
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

    return output;
  };


  /*
   * Calculate the mean from an array of values
   */
  _calculateMean = function (values) {
    var total;

    total = 0;

    for (var i = 0; i < values.length; i++) {
      total += values[i].value;
    }

    return (total / values.length).toFixed(3);
  };


  /**
   * Get plain/text markup for the entire deaggregation report,
   * formatted with line endings
   */
  _this.getReport = function () {
    var deaggregations,
        output;

    deaggregations = _response.get('deaggregations').data();

    // start building report output
    output = [];
    output.push(_getTitle());

    // Loop over deaggregations in the deaggregation response
    for (var i = 0; i < deaggregations.length; i++) {
      output.push(
        _getMetadata(deaggregations[i].get('summary')),
        _getHeader(deaggregations[i].get('component')),
        _getSummary(deaggregations[i].get('summary')),
        _getTable(deaggregations[i].get('data')),
        _getSources(deaggregations[i].get('sources'))
      );
    }

    return output.join(_RETURN_CHARACTERS);
  };


  /**
   * Get html markup for the entire deaggregation report, includes a link to
   * download the report in its entirety. 
   */
  _this.getReportHtml = function () {
    var deaggregations,
        output,
        summary,
        data;

    output = [];
    deaggregations = _response.get('deaggregations').data();

    // Loop over array of values in summary object
    for (var i = 0; i < deaggregations.length; i++) {
      summary = deaggregations[i].get('summary');
      output.push('<h3>Summary statistics for, Deaggregation: ',
          deaggregations[i].get('component'), '</h3>');

      for (var n = 0; n < summary.length; n++) {
        data = summary[n].data;

        if (summary[n].display === false) {
          // skip
          continue;
        }

        output.push('<h4>', summary[n].name, '</h4><dl class="summary">');

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

    return '<a href="data:text/plain;charset=UTF-8,' +
          encodeURIComponent(_this.getReport()) +
        '">Click to Download Deaggregation Report</a>' +
        output.join('');
  };


  _this.destroy = Util.compose(function () {

      _calculateMean = null;
      _checkSummaryValues = null;
      _getHeader = null;
      _getMetadata = null;
      _getSources = null;
      _getSummary = null;
      _getTable = null;
      _getTableBody = null;
      _getTableHeader = null;
      _getTitle = null;
      _setSummaries = null;

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

    // get HTML output
    _this.el.innerHTML = _this.getReportHtml();
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = DeaggregationReportView;