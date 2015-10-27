'use strict';

var AnalysisView = require('AnalysisView'),

    Collection = require('mvc/Collection'),
    View = require('mvc/View'),

    Util = require('util/Util');

var AnalysisCollectionView = function (params) {
  var _this,
      _initialize,

      _collection,
      _destroyCollection,
      _list,
      _views,

      _createView,
      _onAnalysisAdd,
      _onAnalysisDeselect,
      _onAnalysisRemove,
      _onAnalysisReset,
      _onAnalysisSelect,
      _onClick;


  _this = View(params||{});

  _initialize = function (params) {
    params = params || {};

    if (params.collection) {
      _collection = params.collection;
    } else {
      _destroyCollection = true;
      _collection = Collection([]);
    }

    if (_this.el.nodeName.toUpperCase() === 'OL' ||
        _this.el.nodeName.toUpperCase() === 'UL') {
      _list = _this.el;
    } else {
      _list = _this.el.appendChild(document.createElement('ol'));
    }
    _list.classList.add('analysis-collection-list');
    _list.classList.add('no-style');
    _list.addEventListener('click', _onClick);

    _views = Collection([]);
    _onAnalysisReset();

    _collection.on('add', _onAnalysisAdd);
    _collection.on('remove', _onAnalysisRemove);
    _collection.on('reset', _onAnalysisReset);

    _collection.on('select', _onAnalysisSelect);
    _collection.on('deselect', _onAnalysisDeselect);
  };


  _createView = function (analysis) {
    var a,
        view;

    view = AnalysisView({
      el: document.createElement('li'),
      model: analysis
    });

    a = view.el.appendChild(document.createElement('a'));
    a.setAttribute('href', '#');
    a.setAttribute('title', 'Delete');
    a.classList.add('delete');
    a.classList.add('material-icons');
    a.innerHTML = 'close';

    return view;
  };

  _onAnalysisAdd = function (analyses) {
    analyses.forEach(function (analysis) {
      _views.add(_createView(analysis));
    });

    _this.render();
  };

  _onAnalysisDeselect = function (analysis) {
    var view;

    view = _views.get(analysis.id);
    if (view) {
      view.el.classList.remove('selected');
    }
  };

  _onAnalysisRemove = function (analyses) {
    analyses.forEach(function (analysis) {
      var view = _views.get(analysis.id);

      _views.remove(view);
      view.destroy();
    });

    _this.render();
  };

  _onAnalysisReset = function () {
    _views.data().forEach(function (view) {
      _views.remove(view);
      view.destroy();
    });

    _collection.data().forEach(function (analysis) {
      _views.add(_createView(analysis));
    });

    _this.render();
  };

  _onAnalysisSelect = function (analysis) {
    var view;

    view = _views.get(analysis.id);
    if (view) {
      view.el.classList.add('selected');
    }
  };

  _onClick = function (evt) {
    var element,
        id,
        parent;

    evt = Util.getEvent(evt);
    element = evt.target;
    parent = Util.getParentNode(element, 'li', _list);

    if (parent) {
      id = parent.getAttribute('data-analysis-id');
    } else {
      id = null;
    }

    if (id !== null) {
      if (element.classList.contains('delete')) {
        _collection.remove(_collection.get(id));
      } else {
        _collection.selectById(id);
      }
    }

    return evt.originalEvent.preventDefault();
  };


  _this.destroy = Util.compose(function () {
    _list.removeEventListener('click', _onClick);

    _collection.off('add', _onAnalysisAdd);
    _collection.off('remove', _onAnalysisRemove);
    _collection.off('reset', _onAnalysisReset);

    _collection.off('select', _onAnalysisSelect);
    _collection.off('deselect', _onAnalysisDeselect);

    if (_destroyCollection) {
      _collection.destroy();
    }

    _views.destroy();

    _collection = null;
    _destroyCollection = null;
    _list = null;
    _views = null;

    _createView = null;
    _onAnalysisAdd = null;
    _onAnalysisDeselect = null;
    _onAnalysisRemove = null;
    _onAnalysisReset = null;
    _onAnalysisSelect = null;
    _onClick = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    var fragment,
        selected;

    fragment = document.createDocumentFragment();
    selected = _collection.getSelected;

    _collection.data().forEach(function (analysis) {
      var view = _views.get(analysis.id);

      if (view) {
        fragment.insertBefore(view.el, fragment.firstChild);
      }
    });

    Util.empty(_list);
    _list.appendChild(fragment);
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = AnalysisCollectionView;
