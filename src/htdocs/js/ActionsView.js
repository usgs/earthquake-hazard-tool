'use strict';

var Analysis = require('Analysis'),
    AnalysisCollectionView = require('AnalysisCollectionView'),

    Accordion = require('accordion/Accordion'),

    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');

/**
 * Displays an accordion with actions that can be taken on collection items.
 * The ActionsView allows you to create a new analysis in the colleciton, and
 * also validates the current selected analysis model before calculating
 * curve data.
 *
 * ActionsView({
 *   el: document.createElement('div'),
 *   collection: Collection([Analysis])
 * });
 *
 * @param params {Object}
 *        an object with all optional parameters listed above
 */
var ActionsView = function (params) {

  var _this,
      _initialize,

      _accordion,
      _calculateButton,
      _collectionView,
      _errorReportEl,
      _errorsView,
      _newButton,
      _validateOnRender,

      _createNewAnalysis,
      _hasIncompleteCalculation,
      _onAnalysisRemove,
      _onCalculateClick,
      _onNewClick,
      _removeErrorReporting;

  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function (params) {
    var toggleText;

    _errorsView = params.errorsView;

    _this.el.innerHTML = '<div class="error-reporting"></div>';
    _this.el.classList.add('actions-view');

    toggleText = [
      '<button class="actions-view-calculate">Calculate</button>',
      '<button class="actions-view-new">New</button>'
    ].join('');

    _collectionView = AnalysisCollectionView({
      collection: _this.collection,
      el: document.createElement('ul')
    });

    _accordion = Accordion({
      el: _this.el,
      accordions: [
        {
          toggleElement: 'div',
          toggleText: toggleText,
          content: _collectionView.el,
          classes: 'accordion-closed'
        }
      ]
    });

    _errorReportEl = _this.el.querySelector('.error-reporting');

    _calculateButton = _this.el.querySelector('.actions-view-calculate');
    _calculateButton.addEventListener('click', _onCalculateClick);

    _newButton = _this.el.querySelector('.actions-view-new');
    _newButton.addEventListener('click', _onNewClick);

    // Collection bindings
    _this.collection.on('deselect', _removeErrorReporting);
    _this.collection.on('remove', _onAnalysisRemove);

    _validateOnRender = false;
  };

  /**
   * Creates a new Analysis model and adds it to the collection.
   */
  _createNewAnalysis = function () {
    var analysis = Analysis();

    _validateOnRender = false;
    _this.collection.add(analysis);
    _this.collection.select(analysis);
  };

  /**
   * Checks for an Analysis model in the collection with no calculated data.
   *
   * If any of the Analysis models in the collection do not have a data
   * property defined then they are considered incomplete.
   */
  _hasIncompleteCalculation = function () {
    var analyses = [],
        i;

    analyses = _this.collection.data();

    for (i = 0; i < analyses.length; i++) {
      // find an Analysis model with no calculated data
      if (!analyses[i].get('data')) {
        return true;
      }
    }

    return false;
  };

  /**
   * Checks if Analysis model was the last item in the collection, and
   * if the Analysis is incomplete. Then adds a new Analysis model to the
   * collection (if empty), and sets the "new" button disabled state.
   *
   * Triggered by a 'remove' event on the Collection.
   */
  _onAnalysisRemove = function () {

    // if all analysis are complete, enable the "new" button
    if (!_hasIncompleteCalculation()) {
      _newButton.removeAttribute('disabled');
    }

    // if collection is empty, add Analysis model and disable "new" button
    if (_this.collection.data().length === 0) {
      _createNewAnalysis();
      _newButton.setAttribute('disabled', true);
    }
  };

  /**
   * Validates the currently selected Analysis model. Checks if all
   * of the required parameters are set to perform a calculation.
   */
  _onCalculateClick = function () {
    _errorsView.trigger('validate');
  };

  /**
   * Creates a new Analysis model and adds it to the collection, then
   * disables the new button so no more Analysis models can be added.
   *
   * Triggered by a 'click' on the "new" button.
   */
  _onNewClick = function () {
    _createNewAnalysis();
    _newButton.setAttribute('disabled', true);
  };

  /**
   * Removes all of the error output from the view
   */
  _removeErrorReporting = function () {
    _errorReportEl.innerHTML = '';
    _errorReportEl.classList.remove('error');
    _errorReportEl.classList.remove('alert');
  };
  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {

    _calculateButton.removeEventListener('click', _onCalculateClick);
    _newButton.removeEventListener('click', _onNewClick);

    _this.collection.off('deselect', _removeErrorReporting);
    _this.collection.off('remove', _onAnalysisRemove);

    _accordion.destroy();
    _collectionView.destroy();

    _createNewAnalysis = null;
    _hasIncompleteCalculation = null;
    _onAnalysisRemove = null;
    _onCalculateClick = null;
    _onNewClick = null;
    _removeErrorReporting = null;

    _accordion = null;
    _calculateButton = null;
    _collectionView = null;
    _errorReportEl = null;
    _errorsView = null;
    _newButton = null;

    _this = null;
    _initialize = null;

  }, _this.destroy);

  /**
   * Checks if data property on the Analysis model was updated.
   *
   * Called on Analysis model change.
   */
  _this.render = function (changes) {
    // check if Analysis.get('data') was updated
    if (typeof changes !== 'undefined' && changes.hasOwnProperty('data')) {
      // if all analysis are complete, enable the "new" button
      if (!_hasIncompleteCalculation()) {
        _newButton.removeAttribute('disabled');
      }
    }

    if (_validateOnRender) {
      // if already showing errors, rerun validation during render.
      _onCalculateClick();
    }
  };

  _initialize(params);
  params = null;
  return _this;

};

module.exports = ActionsView;
