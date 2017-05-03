'use strict';


var Analysis = require('Analysis'),
    AnalysisView = require('AnalysisView'),
    Collection = require('mvc/Collection'),
    Util = require('util/Util'),
    View = require('mvc/View');


var AnalysisCollectionView = function (params) {
  var _this,
      _initialize;


  _this = View(params||{});

  _initialize = function (params) {
    params = params || {};

    if (params.collection) {
      _this.collection = params.collection;
    } else {
      _this.destroyCollection = true;
      _this.collection = Collection([]);
    }

    if (_this.el.nodeName.toUpperCase() === 'OL' ||
        _this.el.nodeName.toUpperCase() === 'UL') {
      _this.list = _this.el;
    } else {
      _this.list = _this.el.appendChild(document.createElement('ol'));
    }
    _this.list.classList.add('analysis-collection-list');
    _this.list.classList.add('no-style');
    _this.list.addEventListener('click', _this.onClick);

    _this.views = Collection([]);
    _this.onAnalysisReset();

    _this.collection.on('add', 'onAnalysisAdd', _this);
    _this.collection.on('remove', 'onAnalysisRemove', _this);
    _this.collection.on('reset', 'onAnalysisReset', _this);

    _this.collection.on('select', 'onAnalysisSelect', _this);
    _this.collection.on('deselect', 'onAnalysisDeselect', _this);
  };


  _this.createView = function (analysis) {
    var a,
        view;

    view = AnalysisView({
      el: document.createElement('li'),
      model: analysis
    });

    a = view.el.insertBefore(document.createElement('a'),
        view.el.querySelector('.analysis-view-title'));
    a.setAttribute('href', '#');
    a.setAttribute('title', 'Delete');
    a.classList.add('analysis-delete-link');
    a.innerHTML = 'Delete';

    return view;
  };

  _this.destroy = Util.compose(function () {
    _this.list.removeEventListener('click', _this.onClick);

    _this.collection.off('add', 'onAnalysisAdd', _this);
    _this.collection.off('remove', 'onAnalysisRemove', _this);
    _this.collection.off('reset', 'onAnalysisReset', _this);

    _this.collection.off('select', 'onAnalysisSelect', _this);
    _this.collection.off('deselect', 'onAnalysisDeselect', _this);

    if (_this.destroyCollection) {
      _this.collection.destroy();
    }

    _this.views.destroy();

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.onAnalysisAdd = function (analyses) {
    analyses.forEach(function (analysis) {
      _this.views.add(_this.createView(analysis));
    });

    _this.render();
  };

  _this.onAnalysisDeselect = function (analysis) {
    var view;

    view = _this.views.get(analysis.id);
    if (view) {
      view.el.classList.remove('selected');
    }
  };

  _this.onAnalysisRemove = function (analyses) {
    var view;

    analyses.forEach(function (analysis) {
      view = _this.views.get(analysis.id);

      _this.views.remove(view);
      view.destroy();
    });

    if (_this.views.data().length === 0) {
      _this.collection.add(Analysis());
    }

    // if selected analysis was deleted, select newest model in the collection
    if (!_this.collection.getSelected()) {
      _this.collection.select(_this.collection.data()
          [_this.collection.data().length - 1]);
    }

    _this.render();
  };

  _this.onAnalysisReset = function () {
    _this.views.data().forEach(function (view) {
      _this.views.remove(view);
      view.destroy();
    });

    _this.collection.data().forEach(function (analysis) {
      _this.views.add(_this.createView(analysis));
    });

    _this.render();
  };

  _this.onAnalysisSelect = function (analysis) {
    var view;

    view = _this.views.get(analysis.id);
    if (view) {
      view.el.classList.add('selected');
    }
  };

  _this.onClick = function (evt) {
    var element,
        id,
        parent;

    evt = Util.getEvent(evt);
    element = evt.target;
    parent = Util.getParentNode(element, 'li', _this.list);

    if (parent) {
      id = parent.getAttribute('data-analysis-id');
    } else {
      id = null;
    }

    if (id !== null) {
      if (element.classList.contains('analysis-delete-link')) {
        _this.collection.remove(_this.collection.get(id));
      } else {
        _this.collection.selectById(id);
      }
    }

    return evt.originalEvent.preventDefault();
  };

  _this.render = function () {
    var fragment;

    fragment = document.createDocumentFragment();

    _this.collection.data().forEach(function (analysis) {
      var view = _this.views.get(analysis.id);

      if (view) {
        fragment.insertBefore(view.el, fragment.firstChild);
      }
    });

    Util.empty(_this.list);
    _this.list.appendChild(fragment);
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = AnalysisCollectionView;
