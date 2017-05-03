'use strict';

var DownloadView = require('mvc/DownloadView'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Formatter = require('util/Formatter'),

    Util = require('util/Util');

var _RETURN_CHARACTERS;

_RETURN_CHARACTERS = '\n';

var DeaggregationReportView = function (params) {
  var _this,
      _initialize,

      _downloadEl,
      _metadata,
      _reportEl,

      _calculateSum,
      _checkSummaryValues,
      _getHeader,
      _getMetadata,
      _getSources,
      _getSummary,
      _getTable,
      _getTableBody,
      _getTableHeader,
      _getTitle,
      _onDownloadClick,
      _setSummaries;

  _this = SelectedCollectionView(params);


  _initialize = function (/*params*/) {
    _downloadEl = document.createElement('button');
    _downloadEl.className = 'download-deaggregation-report';
    _downloadEl.innerHTML = 'Download Deaggregation Report';

    _reportEl = document.createElement('div');
    _reportEl.className = 'deaggregation-report-summary';

    _this.el.classList.add('deaggregation-report-view');
    _this.el.appendChild(_reportEl);

    // bind event listeners
    _downloadEl.addEventListener('click', _onDownloadClick);

    _this.render();
  };

  _onDownloadClick = function () {
    DownloadView({
      collection: _this.getReport(),
      format: function (text) {
        return text;
      },
      title: 'Deaggregation Report'
    }).show();
  };


  /**
   * Get plain/text markup for the response metadata,
   * formatted with line endings
   */
  _getTitle = function (edition) {
    return [
      '*** Deaggregation of Seismic Hazard at One Period of Spectral ' +
          'Acceleration ***',
      '*** Data from ' + edition + ' ****'
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
    var metadata,
        output,
        summaryMarkup;

    metadata = _this.model.get('metadata');
    output = [];
    summaryMarkup = _checkSummaryValues(summary);

    output.push(
      'PSHA Deaggregation. %contributions.',
      'site: Test',
      'longitude: ' + Formatter.longitude(metadata.longitude),
      'latitude: ' + Formatter.longitude(metadata.latitude),
      'imt: ' + metadata.imt.display,
      'vs30 = ' + metadata.vs30.display,
      'return period: ' + metadata.returnperiod + ' yrs.'
    );

    if (summaryMarkup.length !== 0) {
      output.push(summaryMarkup.join(_RETURN_CHARACTERS));
    }

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

    output = ['Summary statistics for PSHA PGA deaggregation, r=distance, ε=epsilon:'];

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
    ].join('');
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
      row.push(data[i].r, data[i].m, _calculateSum(data[i].εdata));

      // edata values
      for (var x = 0; x < _metadata.εbins.length; x++) {
        row.push(edata[x] ? edata[x].value.toFixed(3) : (0.000).toFixed(3));
      }

      // add row to output
      output.push(row.join('\t'));
    }

    // join with line endings
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

    ebins = _metadata.εbins;
    output = [];
    output.push( _metadata.rlabel + '\t' + _metadata.mlabel + '\tALL_ε');

    for (var i = (ebins.length - 1); i >= 0; i--) {
      min = (ebins[i].min ? '[' + ebins[i].min : '(-∞');
      max = (ebins[i].max ? ebins[i].max + ')' : '∞)');
      output.push('ε' + '=' + min + ',' + max);
    }

    return output.join('\t') + _RETURN_CHARACTERS;
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
  _calculateSum = function (values) {
    var total;

    total = 0;

    for (var i = 0; i < values.length; i++) {
      total += values[i].value;
    }

    return (total).toFixed(3);
  };


  /**
   * Get plain/text markup for the entire deaggregation report,
   * formatted with line endings
   */
  _this.getReport = function () {
    var deaggregations,
        metadata,
        output;

    metadata = _this.model.get('metadata');

    // start building report output
    output = [];
    output.push(_getTitle(metadata.edition.display));
    deaggregations = _this.collection.data();

    // Loop over deaggregations in the collection
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
    var output,
        summary,
        data;

    summary = _this.model.get('summary');
    output = [];
    output.push('<h3>Summary statistics for, Deaggregation: ',
        _this.model.get('component'), '</h3>',
        '<div class="summary-group">');

    for (var i = 0; i < summary.length; i++) {

      data = summary[i].data;

      if (summary[i].display === false) {
        // skip
        continue;
      }

      output.push('<div class="summary-values">',
        '<h4>', summary[i].name, '</h4>',
        '<dl class="summary-list">');

      for (var x = 0; x < data.length; x++) {
        output.push(
          '<dt>', data[x].name + '</dt>' +
          '<dd>' + data[x].value +
              (data[x].units ? ' ' + data[x].units : '') + '</dd>'
        );
      }

      output.push('</dl></div>');
    }

    output.push('</div>');

    // get contributing sources
    output.push(
      '<div class="contributors-section">',
        '<h4>Deaggregation Contributors</h4>',
        _this.getSources(),
      '</div>');

    return output.join('');
  };

  /**
   * [getSources description]
   *
   * @return {[type]} [description]
   */
  _this.getSources = function () {
    var buf,
        i,
        len,
        source,
        sources;

    // all contributing sources from deagg response
    sources = _this.model.get('sources');

    buf = [
      '<table class="contributing-sources">',
        '<thead>',
          '<tr>',
            '<th>Source Set <i class="material-icons down-arrow">&#xE5DA;</i>',
              ' Source</th>',
            '<th>Type</th>',
            '<th title="distance (km)">r</th>',
            '<th title="magnitude">m</th>',
            '<th title="epsilon (mean values)">ε<sub>0</sub></th>',
            '<th title="longitude">lon</th>',
            '<th title="latitude">lat</th>',
            '<th title="azimuth">az</th>',
            '<th title="percent contributed" title="">%</th>',
          '</tr>',
        '</thead>',
        '<tbody>'
    ];

    for (i = 0, len = sources.length; i < len; i++) {
      source = sources[i];
      buf.push(_this.createSourceSetRow(source));
    }

    buf.push(
        '</tbody>',
      '</table>'
    );

    return '<div class="horizontal-scrolling">' + buf.join('') + '</div>';
  };

  _this.createSourceSetRow = function (source) {
    var buf,
        type;

    buf = [];
    type = source.type;

    if (type.toUpperCase() === 'SET') {
      buf.push(
        '<tr class="contributor-set">',
          '<td>', source.name, '</td>',
          '<td>', source.source, '</td>',
          '<td colspan="6"></td>',
          '<td>', Formatter.number(source.contribution, 2), '</td>',
        '</tr>'
      );
    } else {
      buf.push(
        '<tr>',
          '<td class="indent-name">', source.name, '</td>',
          '<td></td>', // empty row for type
          '<td>', Formatter.number(source.r, 2), '</td>',
          '<td>', Formatter.number(source.m, 2), '</td>',
          '<td>', Formatter.number(source.ε, 2), '</td>',
          '<td>', Formatter.longitude(source.longitude), '</td>',
          '<td>', Formatter.latitude(source.latitude), '</td>',
          '<td>', Formatter.number(source.azimuth, 2), '</td>',
          '<td>', Formatter.number(source.contribution, 2), '</td>',
        '</tr>'
      );
    }

    return buf.join('');
  };

  _this.destroy = Util.compose(function () {

    _reportEl.removeEventListener('click', _onDownloadClick);

    _calculateSum = null;
    _checkSummaryValues = null;
    _getHeader = null;
    _getMetadata = null;
    _getSources = null;
    _getSummary = null;
    _getTable = null;
    _getTableBody = null;
    _getTableHeader = null;
    _getTitle = null;
    _onDownloadClick = null;
    _setSummaries = null;

    _downloadEl = null;
    _metadata = null;
    _reportEl = null;

    _initialize = null;
    _this =  null;
  }, _this.destroy);


  _this.render = function () {

    // If no deagg is selected remove download button & report
    if (!_this.model) {
      _reportEl.innerHTML = '';

      if (_this.el.contains(_downloadEl)) {
        _this.el.removeChild(_downloadEl);
      }

      return;
    }

    // build summary report with download link
    _metadata = _this.model.get('metadata');
    _this.el.insertBefore(_downloadEl, _reportEl);
    _reportEl.innerHTML = _this.getReportHtml();
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = DeaggregationReportView;
