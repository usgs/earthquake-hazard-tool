'use strict';

var DownloadView = require('mvc/DownloadView'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');

var DataExport = function (params) {
  var _this,
      _initialize,

      _button,
      _downloadView,

      _onClick;

  _this = SelectedCollectionView(params);

  /**
   * Sets up and creates button
   */
  _initialize = function () {
    _downloadView = null;

    _this.el.innerHTML =
      '<button class="download-data-button"type="button">' +
        'Download Data' +
      '</button>';

    _button = _this.el.querySelector('.download-data-button');
    _button.addEventListener('click', _onClick);
  };

  /**
   * Creates the download view when button is clicked
   */
  _onClick = function () {
    if (_downloadView !== null) {
      _downloadView.destroy();
    }

    _downloadView = DownloadView({
      collection: _this.model,
      format: _this.format,
      title: 'Download Data',
      help: 'Copy then paste into a spreadsheet application'
    });

    _downloadView.show();
  };

  /**
   * Formats data for download view
   * @param model {object}
   *        model data
   */
  _this.format = function (model) {
    var buf,
        curves;

    buf = [];
    curves = model.get('curves').get('curves');

    buf.push(
        'Edition: ' + model.get('edition') + '\n' +
        'Region: ' + model.get('region') + '\n' +
        'Vs30: ' + model.get('vs30') + '\n' +
        'Latitude: ' + model.get('location').latitude + '\n' +
        'Longitude: ' + model.get('location').longitude + '\n');
    curves.data().forEach(function (curve) {
      var data;

      data = curve.get('data');

      // Curve label
      buf.push(curve.get('label') + '\n');

      // Loops threw X values
      data.forEach(function (d, i) {
        if (i !== 0) {
          buf.push('\t');
        }
        buf.push(d[0]);
      });
      buf.push('\n');

      // Loops threw Y values
      data.forEach(function (d, i) {
        if (i !== 0) {
          buf.push('\t');
        }
        buf.push(d[1]);
      });
      buf.push('\n');

    });
    return buf.join('');
  };

  /**
   * Checks to see if model exists and sets button to either disabled or
   * enabled.
   */
  _this.render = function () {
    if (_this.model === null ) {
      _button.setAttribute('disabled', 'disabled');
    } else {
      _button.removeAttribute('disabled');
    }
  };

  /**
   * Destroy all the things.
   */
  _this.destroy = Util.compose(function () {
    if (_downloadView !== null) {
      _downloadView.destroy();
      _downloadView = null;
    }

    _button.removeEventListener('click', _onClick);
    _button = null;
    _initialize = null;
    _this = null;
  }, _this.destroy);

  _initialize();
  params = null;
  return _this;
};

module.exports = DataExport;
