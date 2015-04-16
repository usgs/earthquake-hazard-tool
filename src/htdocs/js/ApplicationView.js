'use strict';

var Analysis = require('Analysis'),
    AnalysisCollectionView = require('AnalysisCollectionView'),
    MapView = require('MapView'),
    StaticCurveOutputView = require('StaticCurveOutputView'),

    Collection = require('mvc/Collection'),
    View = require('mvc/View'),

    TabList = require('tablist/TabList');


var ApplicationView = function (params) {
  var _this,
      _initialize,

      // variables
      _analysisCollection,
      _collectionView,
      _collectionViewEl,
      _contentEl,
      _mapView,
      _newAnalysisBtn,
      _offCanvasEl,
      _staticCurveView,
      _tabList,
      _tabListEl,
      _toggleButton,

      // methods
      _initViewContainer,
      _onNewAnalysisClick,
      _onOffCanvasClick;


  _this = View(params);

  _initialize = function (/*params*/) {
    _initViewContainer();

    _analysisCollection = Collection([]);

    _mapView = MapView();

    _staticCurveView = StaticCurveOutputView({
      collection: _analysisCollection
    });

    _collectionView = AnalysisCollectionView({
      el: _offCanvasEl.appendChild(document.createElement('ol')),
      collection: _analysisCollection
    });


    // create tablist as part of section.main-content
    _tabList = TabList({
      el: _tabListEl,
      tabs: [
        {
          'title': 'Map',
          'content': _mapView.el,
          'onSelect': _mapView.onSelect,
          'onDeselect': _mapView.onDeselect
        },
        {
          title: 'Static Curves',
          content: _staticCurveView.el,
          onSelect: _staticCurveView.onTabSelect,
          onDeselect: _staticCurveView.onTabDeselect
        }
      ]
    });
  };


  _initViewContainer = function () {
    _this.el.className = 'application-container';

    _contentEl = _this.el.querySelector('.application-content') ||
        document.createElement('section');
    _toggleButton = _this.el.querySelector('.offcanvas-toggle') ||
        document.createElement('button');
    _tabListEl = _this.el.querySelector('.main-content') ||
        document.createElement('section');
    _offCanvasEl = _this.el.querySelector('.offcanvas-content') ||
        document.createElement('section');

    _offCanvasEl.innerHTML = [
      '<button class="green analysis-create">Create New Calculation</button>',
      '<ol></ol>'
    ].join('');

    _collectionViewEl = _offCanvasEl.querySelector('ol');
    _newAnalysisBtn = _offCanvasEl.querySelector('button');

    _toggleButton.addEventListener('click', _onOffCanvasClick);
    _newAnalysisBtn.addEventListener('click', _onNewAnalysisClick);
  };

  _onNewAnalysisClick = function () {
    var analysis = Analysis();

    _analysisCollection.add(analysis);
    _analysisCollection.select(analysis);
  };

  _onOffCanvasClick = function () {
    _contentEl.classList.toggle('offcanvas-enabled');
  };


  _this.destroy = function () {
    // events
    _toggleButton.removeEventListener('click', _onOffCanvasClick);

    _staticCurveView.destroy();
    _staticCurveView = null;

    _collectionView.destroy();
    _collectionView = null;

    // variables
    _toggleButton = null;

    // methods
    _onOffCanvasClick = null;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ApplicationView;
