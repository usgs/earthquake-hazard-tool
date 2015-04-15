'use strict';

var Analysis = require('Analysis'),
    AnalysisView = require('AnalysisView'),
    Collection = require('mvc/Collection'),
    Util = require('util/Util'),
    View = require('mvc/View');

var AnalysisCollectionView = function (options) {
  var _this,
      _initialize,

      _analysisCollection,
      _viewCollection,
      _lastAnalysisID,
      _currentAnalysisId,
      _options,
      _ol,

      _addAddAnalysisButton,
      _addAnalysisCollection,
      _addAnalysisView,

      _onAddAnalysis,
      _onAddAnalysisClick,
      _onDeleteAnalysis,
      _onListClick,
      _onChangeAnalysis,

      _deselectCurrentAnalysis,
      _setCurrentAnalysis;

  _this = View(options);

  _initialize = function(options) {
    var section = document.createElement('section'),
        collectionLength;
    _options = Util.extend({}, {}, options);
    _analysisCollection = _options.analysisCollection;

    _viewCollection = Collection();

    _analysisCollection.on('add', _onAddAnalysis);
    // _analysisCollection.on('remove', _onRemove);
    // _analysisCollection.on('reset', _onReset);
    _analysisCollection.on('select', _setCurrentAnalysis);
    _analysisCollection.on('deselect', _deselectCurrentAnalysis);

    section.classList.add('analysisCollectionView');
    section.appendChild(_addAddAnalysisButton());
    section.appendChild(_addAnalysisCollection());

    _this.el.innerHTML = '';
    _this.el.appendChild(section);
    collectionLength = _analysisCollection.data().length;
    if (collectionLength > 0) {
      _currentAnalysisId = _analysisCollection.data()[collectionLength-1].id;
      _analysisCollection.selectById(_currentAnalysisId);
    }
  };

  _addAddAnalysisButton = function () {
    var section =document.createElement('section'),
        addAnalysisButton = document.createElement('button');

    addAnalysisButton.classList.add('addAnalysisButton');
    addAnalysisButton.innerHTML = 'Add Analysis';
    addAnalysisButton.addEventListener('click', _onAddAnalysisClick);

    section.classList.add('addAnalysisButton');
    section.appendChild(addAnalysisButton);
    return section;
  };

  _addAnalysisCollection = function() {
    var i,
        len,
        data,
        section = document.createElement('section');

    _ol = document.createElement('ol');
    _ol.classList.add('analysisCollection');
    _ol.id = 'analysis';
    _ol.addEventListener('click', _onListClick);
    section.classList.add('analysisCollection');
    section.appendChild(_ol);
    if (_analysisCollection.data().length > 0) {
      data = _analysisCollection.data();
      for (i = 0, len = data.length; i < len; i++) {
        _addAnalysisView(data[i], _ol, 'analysis-' + data[i].get('id'));
      }
    }
    return section;
  };

  _addAnalysisView = function(analysis, container, name) {
    var li = document.createElement('li');

    li.classList.add('analysisView');
    li.id = name;
    if (container.childNodes[0] !== null) {
      container.insertBefore(li, container.childNodes[0]);
    }
    else {
      container.appendChild(li);
    }
    _viewCollection.add(
        AnalysisView({
            id:analysis.id,
            analysis:analysis,
            container: li,
            name:name
    }));
  };

  _onAddAnalysis = function () {
    var length = _analysisCollection.data().length,
        analysis = _analysisCollection.data()[length-1],
        name = 'analysis-' + analysis.get('id');
    _addAnalysisView(analysis, _ol, name);
    _analysisCollection.select(analysis);
  };

  _onAddAnalysisClick = function () {
    var analysis = new Analysis();

    analysis.set({'id': Date.now()});
    _analysisCollection.add(analysis);
  };

  _onChangeAnalysis = function (index) {
    _analysisCollection.selectById(index);
  };

  _onDeleteAnalysis = function (index) {
    var analysis,
        liElement,
        view,
        collectionLength,
        currentAnalysisId = _currentAnalysisId;

    analysis = _analysisCollection.get(index);
    _analysisCollection.remove(analysis);
    view = _viewCollection.get(index);
    liElement = document.getElementById('analysis-' + index);
    _ol.removeChild(liElement);

    view.destroy();
    collectionLength = _analysisCollection.data().length;
    if (collectionLength > 0 && currentAnalysisId === index) {
      _currentAnalysisId =
          _analysisCollection.data()[collectionLength-1].get('id');
      _analysisCollection.selectById(_currentAnalysisId);
    }
  };

  _onListClick = function (ev) {
    var src = ev.srcElement,
        index;
    if (src.nodeName === 'DIV') {
      index = parseInt(src.id.replace('analysis-', ''));
      _onChangeAnalysis(index);
    }
    else if (src.nodeName === 'A') {
      index = parseInt(src.id.replace('analysis-', ''));
      _onDeleteAnalysis(index);
    }
  };

  _deselectCurrentAnalysis = function () {
    if (_currentAnalysisId !== undefined) {
      _lastAnalysisID = _currentAnalysisId;
      document.getElementById(
          'analysis-' + _currentAnalysisId).classList.remove('selected');
    }
    _currentAnalysisId = undefined;
  };

  _setCurrentAnalysis = function () {
    //TODO deal with nothing in list.
    _currentAnalysisId = _analysisCollection.getSelected().id;
    document.getElementById(
        'analysis-' + _currentAnalysisId).classList.add('selected');
  };

    /**
   * Undo initialization and free references.
   */
  _this.destroy = Util.compose(function () {

    _analysisCollection.off('add', _onAddAnalysis);
    //_analysisCollection.off('remove', _this.render);
    //_analysisCollection.off('reset', _this.render);
    _analysisCollection.off('select', _setCurrentAnalysis);
    _analysisCollection.off('deselect', _deselectCurrentAnalysis);
    _analysisCollection = null;
    //TODO Are these doing anything, or do I need to be more specific.
    _this.el.removeEventListener('click', _onListClick);
    _this.el.removeEventListener('click', _onAddAnalysisClick);
  }, _this.destroy);

  _this.render = function () {
    //TODO steal from _initialize.
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports =  AnalysisCollectionView;
