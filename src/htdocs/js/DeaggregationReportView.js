'use strict';


var DownloadView = require('mvc/DownloadView'),
    Formatter = require('util/Formatter'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');


var _RETURN_CHARACTERS;

_RETURN_CHARACTERS = '\n';

var DeaggregationReportView = function (params) {
  var _this,
      _initialize;

  _this = SelectedCollectionView(params);


  _initialize = function (/*params*/) {
    _this.downloadEl = document.createElement('button');
    _this.downloadEl.className = 'download-deaggregation-report';
    _this.downloadEl.innerHTML = 'Download Deaggregation Report';

    _this.reportEl = document.createElement('div');
    _this.reportEl.className = 'deaggregation-report-summary';

    _this.el.classList.add('deaggregation-report-view');
    _this.el.appendChild(_this.reportEl);

    // bind event listeners
    _this.downloadEl.addEventListener('click', _this.onDownloadClick);

    _this.render();
  };


  /*
   * Calculate the mean from an array of values
   */
  _this.calculateSum = function (values) {
    var total;

    total = 0;

    for (var i = 0; i < values.length; i++) {
      total += values[i].value;
    }

    return (total).toFixed(3);
  };

  /**
   * Parse through deaggregation summary values to see if any values should be
   * added to the metadata section.
   */
  _this.checkSummaryValues = function (summary) {
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
    _this.reportEl.removeEventListener('click', _this.onDownloadClick);

    _initialize = null;
    _this =  null;
  }, _this.destroy);

  /**
   * Get plain/text markup for the deaggregation header
   */
  _this.getHeader = function (component) {
    return '#This deaggregation corresponds to: ' + component;
  };

  /**
   * Get plain/text markup for the response metadata,
   * formatted with line endings
   */
  _this.getMetadata = function (summary) {
    var metadata,
        output,
        summaryMarkup;

    metadata = _this.model.get('metadata');
    output = [];
    summaryMarkup = _this.checkSummaryValues(summary);

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
    output.push(_this.getTitle(metadata.edition.display));
    deaggregations = _this.collection.data();

    // Loop over deaggregations in the collection
    for (var i = 0; i < deaggregations.length; i++) {
      output.push(
        _this.getMetadata(deaggregations[i].get('summary')),
        _this.getHeader(deaggregations[i].get('component')),
        _this.getSummary(deaggregations[i].get('summary')),
        _this.getTable(deaggregations[i].get('data')),
        _this.getSources(deaggregations[i].get('sources'))
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
    output.push(_this.getSources());

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

    if (!sources || sources.length === 0) {
      return;
    }

    buf = [
      '<div class="contributors-section">',
        '<h4>Deaggregation Contributors</h4>',
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
        '</table>',
      '</div>'
    );

    return '<div class="horizontal-scrolling">' + buf.join('') + '</div>';
  };

  /**
   * Get plain/text markup for the deaggregation summary data,
   * formatted with line endings
   */
  _this.getSummary = function (summaries) {
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
  _this.getTable = function (data) {
    return [
      _this.getTableHeader(),
      _this.getTableBody(data)
    ].join('');
  };


  /**
   * Get plain/text markup for the table body, formatted using tab delimiters
   */
  _this.getTableBody = function (data) {
    var output,
        row,
        edata;

    output = [];

    for (var i = (data.length - 1); i >= 0; i--) {
      edata = data[i].εdata;
      row = [];

      // distance, magnitude, and mean values
      row.push(data[i].r, data[i].m, _this.calculateSum(data[i].εdata));

      // edata values
      for (var x = 0; x < _this.metadata.εbins.length; x++) {
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
  _this.getTableHeader = function () {
    var output,
        ebins,
        min,
        max;

    ebins = _this.metadata.εbins;
    output = [];
    output.push( _this.metadata.rlabel + '\t' + _this.metadata.mlabel + '\tALL_ε');

    for (var i = (ebins.length - 1); i >= 0; i--) {
      min = (ebins[i].min ? '[' + ebins[i].min : '(-∞');
      max = (ebins[i].max ? ebins[i].max + ')' : '∞)');
      output.push('ε' + '=' + min + ',' + max);
    }

    return output.join('\t') + _RETURN_CHARACTERS;
  };

  /**
   * Get plain/text markup for the response metadata,
   * formatted with line endings
   */
  _this.getTitle = function (edition) {
    return [
      '*** Deaggregation of Seismic Hazard at One Period of Spectral ' +
          'Acceleration ***',
      '*** Data from ' + edition + ' ****'
    ].join(_RETURN_CHARACTERS);
  };


  _this.onDownloadClick = function () {
    DownloadView({
      collection: _this.getReport(),
      format: function (text) {
        return text;
      },
      title: 'Deaggregation Report'
    }).show();
  };

  _this.render = function () {

    // If no deagg is selected remove download button & report
    if (!_this.model) {
      _this.reportEl.innerHTML = '';

      if (_this.el.contains(_this.downloadEl)) {
        _this.el.removeChild(_this.downloadEl);
      }

      return;
    }

    // build summary report with download link
    _this.metadata = _this.model.get('metadata');
    _this.el.insertBefore(_this.downloadEl, _this.reportEl);
    _this.reportEl.innerHTML = _this.getReportHtml();
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = DeaggregationReportView;
