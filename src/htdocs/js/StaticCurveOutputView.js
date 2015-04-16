'use strict';

var Analysis = require('Analysis'),
    HazardCurveGraphView = require('HazardCurveGraphView'),
    StaticCurveInputView = require('StaticCurveInputView'),

    Collection = require('mvc/Collection'),
    View = require('mvc/View'),

    Util = require('util/Util');

var StaticCurveOutputView = function (params) {
  var _this,
      _initialize,

      _analysisCollection,
      _curvesCollection,
      _destroyCollection,
      _editionEl,
      _editButton,
      _graphView,
      _graphViewEl,
      _imtEl,
      _inputView,
      _locationEl,
      _regionEl,
      _tableView,
      _tableViewEl,
      _vs30El,

      _createViewSkeleton,
      _onEditClick,
      _onAnalysisDeselect,
      _onAnalysisSelect,
      _updateMetadata;


  _this = View(params||{});

  _initialize = function (params) {
    params = params || {};

    if (params.collection) {
      _analysisCollection = params.collection;
    } else {
      _analysisCollection = Collection([]);
    }

    _curvesCollection = Collection([]);

    _createViewSkeleton();

    // TODO :: make a real table view
    _tableView = View({
      el: _tableViewEl,
    });

    _graphView = HazardCurveGraphView({
      el: _graphViewEl,
      curves: _curvesCollection
    });

    _inputView = StaticCurveInputView();
  };


  _createViewSkeleton = function () {

    _this.el.innerHTML = [
      '<h2>Metadata</h2>',
      '<button class="staticcurve-edit">Edit</button>',
      '<dl class="staticcurve-output-metadata">',
        '<dt class="edition label">Edition</dt>',
        '<dd class="edition value"></dd>',
        '<dt class="region label">Region</dt>',
        '<dd class="region value"></dd>',
        '<dt class="location label">Location</dt>',
        '<dd class="location value"></dd>',
        '<dt class="imt label">IMT</dt>',
        '<dd class="imt value"></dd>',
        '<dt class="vs30 label">Vs30</dt>',
        '<dd class="vs30 value"></dd>',
      '</dl>',
      '<h2>Graph</h2>',
      '<div class="graph-wrapper"></div>',
      '<h2>Data</h2>',
      '<div class="table-wrapper"></div>'
    ].join('');

    _editionEl = _this.el.querySelector('dd.edition');
    _regionEl = _this.el.querySelector('dd.region');
    _locationEl = _this.el.querySelector('dd.location');
    _imtEl = _this.el.querySelector('dd.imt');
    _vs30El = _this.el.querySelector('dd.vs30');

    _graphViewEl = _this.el.querySelector('.graph-wrapper');
    _tableViewEl = _this.el.querySelector('.table-wrapper');

    _editButton = _this.el.querySelector('.staticcurve-edit');
    _editButton.addEventListener('click', _onEditClick);
  };

  _onAnalysisDeselect = function (analysis) {
    analysis.off('change', _this.render);
    _this.render(); // Clear the view
  };

  _onAnalysisSelect = function (analysis) {
    analysis.on('change', _this.render);
    _this.render(); // Update the view
  };

  _onEditClick = function () {
    _inputView.show(_analysisCollection.getSelected());
  };

  _updateMetadata = function (analysis) {
    var edition,
        imt,
        latitude,
        longitude,
        region,
        vs30;

    edition = analysis.get('edition');
    region = analysis.get('region');

    longitude = analysis.get('longitude');
    latitude = analysis.get('latitude');

    imt = analysis.get('imt');
    vs30 = analysis.get('vs30');

    if (edition) {
      _editionEl.innerHTML = edition.get('display');
    }
    if (region) {
      _regionEl.innerHTML = region.get('display');
    }
    if (latitude !== null && longitude !== null) {
      _locationEl.innerHTML = '(' + parseFloat(latitude).toFixed(3) + ', ' +
          parseFloat(longitude).toFixed(3) + ')';
    }
    if (imt) {
      _imtEl.innerHTML = imt.get('display');
    }
    if (vs30) {
      _vs30El.innerHTML = vs30.get('display');
    }
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _editButton.removeEventListener('click', _onEditClick);

    _tableView.destroy();
    _inputView.destroy();
    _graphView.destroy();

    _this.onTabDeselect();
    if (_destroyCollection) {
      _analysisCollection.destroy();
    }

    _curvesCollection.destroy();


    _analysisCollection = null;
    _curvesCollection = null;
    _destroyCollection = null;
    _editionEl = null;
    _editButton = null;
    _graphView = null;
    _graphViewEl = null;
    _imtEl = null;
    _inputView = null;
    _locationEl = null;
    _regionEl = null;
    _tableView = null;
    _tableViewEl = null;
    _vs30El = null;


    _createViewSkeleton = null;
    _onAnalysisDeselect = null;
    _onAnalysisSelect = null;
    _updateMetadata = null;


    _initialize = null;
    _this = null;
  });

  _this.onTabDeselect = function () {
    try {
      _analysisCollection.off('select', _onAnalysisSelect);
    } catch (e) { /* ignore */ }

    try {
      _analysisCollection.off('deselect', _onAnalysisDeselect);
    } catch (e) { /* ignore */ }
  };

  _this.onTabSelect = function () {
    var selected = _analysisCollection.getSelected();

    _analysisCollection.on('select', _onAnalysisSelect);
    _analysisCollection.on('deselect', _onAnalysisDeselect);

    if (!selected) {
      selected = Analysis({id: (new Date()).getTime()});
      _analysisCollection.add(selected);
      _analysisCollection.select(selected);
    } else {
      _onAnalysisSelect(selected);
    }
  };

  _this.render = function () {
    var analysis,
        curves,
        staticResponse;

    analysis = _analysisCollection.getSelected();

    if (analysis) {
      _updateMetadata(analysis);

      staticResponse = analysis.get('staticcurve');

      if (!staticResponse) {
        _inputView.show(analysis);
      } else {
        curves = staticResponse.get('curves');
        // Set axes silently since reset will trigger a render immediately after
        _graphView.model.set({
          xAxisLabel: staticResponse.get('xlabel'),
          yAxisLabel: staticResponse.get('ylabel')
        }, {silent: true});
        _curvesCollection.reset(curves.data());
      }
    } else {
      // Clear everything
      _editionEl.innerHTML = '';
      _regionEl.innerHTML = '';

      _locationEl.innerHTML = '';

      _imtEl.innerHTML = '';
      _vs30El.innerHTML = '';

      _graphView.model.set({
        xAxisLabel: '',
        yAxisLabel: ''
      });
      _curvesCollection.reset([]);
    }
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = StaticCurveOutputView;
