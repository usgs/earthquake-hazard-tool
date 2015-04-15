'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');

var AnalysisView = function (options) {
  var _this,
      _initialize,
      _options,

      _div,

      _onChange;


  _this = View(options);

  _initialize = function (options) {
    _options = Util.extend({}, {}, options);
    _options.analysis.on('change', _onChange);

    _this.id = _options.id;

    _div = document.createElement('div');
    _div.id = _options.name;
    _div.classList.add('analysisView');

    _options.container.appendChild(_div);

    _this.render();
  };

  _onChange = function () {
    _this.render();
  };

  _this.destroy = Util.compose(function () {
    _options.analysis.off('change', _onChange);
  }, _this.destroy);

  _this.render = function () {
    var analysis = _options.analysis,
        name = _options.name,
        editionDisplay = 'New Analysis',
        latitude = 0,
        longitude = 0,
        imtValue = '',
        vs30Value = '';

    if (analysis.get('edition') !== null) {
      editionDisplay = analysis.get('edition').get('display');
    }
    if (analysis.get('latitude') !== null) {
      latitude = analysis.get('latitude');
    }
    if (analysis.get('longitude') !== null) {
      longitude = analysis.get('longitude');
    }
    if (analysis.get('imt') !== null) {
      imtValue = analysis.get('imt').get('value');
    }
    if (analysis.get('vs30') !== null) {
      vs30Value = analysis.get('vs30').get('value');
    }

    _div.innerHTML = editionDisplay + '<br>(' +
        latitude + ', ' + longitude + ') ' + imtValue + ', ' + vs30Value +
        ' ' + '<a href="javascript:void(null);" id=' + name + '>Delete</a>';
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports =  AnalysisView;
