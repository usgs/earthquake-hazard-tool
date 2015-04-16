'use strict';

var Analysis = require('Analysis'),

    View = require('mvc/View'),

    Util = require('util/Util');


var AnalysisView = function (params) {
  var _this,
      _initialize,

      _locationEl,
      _model,
      _paramsEl,
      _titleEl,

      _createViewSkeleton,
      _onModelChange;


  _this = View(params||{});

  _initialize = function (params) {
    params = params || {};

    _model = params.model || Analysis({id: (new Date()).getTime()});
    _this.id = _model.id;

    _this.el.setAttribute('data-analysis-id', _model.id);
    _createViewSkeleton();

    _model.on('change', _onModelChange);
    _this.render();
  };


  _createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<span class="analysis-view-title"></span>',
      '<span class="analysis-view-metadata">',
        '<span class="analysis-view-location"></span>',
        '<span class="analysis-view-params"></span>',
      '</span>'
    ].join('');

    _titleEl = _this.el.querySelector('.analysis-view-title');
    _locationEl = _this.el.querySelector('.analysis-view-location');
    _paramsEl = _this.el.querySelector('.analysis-view-params');
  };

  _onModelChange = function () {
    _this.render();
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _model.off('change', _onModelChange);

    _locationEl = null;
    _model = null;
    _paramsEl = null;
    _titleEl = null;

    _createViewSkeleton = null;
    _onModelChange = null;

    _initialize = null;
    _this = null;
  });

  _this.render = function () {
    var edition,
        imt,
        latitude,
        longitude,
        region,
        txtTitle,
        txtLocation,
        txtParams,
        vs30;

    edition = _model.get('edition');
    region = _model.get('region');

    longitude = _model.get('longitude');
    latitude = _model.get('latitude');

    imt = _model.get('imt');
    vs30 = _model.get('vs30');

    if (edition) {
      txtTitle = edition.get('display');
    } else {
      txtTitle = 'Unknown';
    }

    if (latitude !== null && longitude !== null) {
      txtLocation = '(' + latitude.toFixed(3) + ', ' +
          longitude.toFixed(3) + ')';
    } else {
      txtLocation = '(&ndash;, &ndash;)';
    }

    if (imt) {
      txtParams = imt.get('value') + ', ';
    } else {
      txtParams = '&ndash;, ';
    }

    if (region) {
      txtParams += region.get('value') + ', ';
    } else {
      txtParams += '&ndash;, ';
    }

    if (vs30) {
      txtParams += vs30.get('value');
    } else {
      txtParams += '&ndash;';
    }

    _titleEl.innerHTML = txtTitle;
    _locationEl.innerHTML = txtLocation;
    _paramsEl.innerHTML = txtParams;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = AnalysisView;

// 'use strict';

// var Util = require('util/Util'),
//     View = require('mvc/View');

// var AnalysisView = function (options) {
//   var _this,
//       _initialize,
//       _options,

//       _div,

//       _onChange;


//   _this = View(options);

//   _initialize = function (options) {
//     _options = Util.extend({}, {}, options);
//     _options.analysis.on('change', _onChange);

//     _this.id = _options.id;

//     _div = document.createElement('div');
//     _div.id = _options.name;
//     _div.classList.add('analysisView');

//     _options.container.appendChild(_div);

//     _this.render();
//   };

//   _onChange = function () {
//     _this.render();
//   };

//   _this.destroy = Util.compose(function () {
//     _options.analysis.off('change', _onChange);
//   }, _this.destroy);

//   _this.render = function () {
//     var analysis = _options.analysis,
//         name = _options.name,
//         editionDisplay = 'New Analysis',
//         latitude = 0,
//         longitude = 0,
//         imtValue = '',
//         vs30Value = '';

//     if (analysis.get('edition') !== null) {
//       editionDisplay = analysis.get('edition').get('display');
//     }
//     if (analysis.get('latitude') !== null) {
//       latitude = analysis.get('latitude');
//     }
//     if (analysis.get('longitude') !== null) {
//       longitude = analysis.get('longitude');
//     }
//     if (analysis.get('imt') !== null) {
//       imtValue = analysis.get('imt').get('value');
//     }
//     if (analysis.get('vs30') !== null) {
//       vs30Value = analysis.get('vs30').get('value');
//     }

//     _div.innerHTML = editionDisplay + '<br>(' +
//         latitude + ', ' + longitude + ') ' + imtValue + ', ' + vs30Value +
//         ' ' + '<a href="javascript:void(null);" id=' + name + '>Delete</a>';
//   };

//   _initialize(options);
//   options = null;
//   return _this;
// };

// module.exports =  AnalysisView;
