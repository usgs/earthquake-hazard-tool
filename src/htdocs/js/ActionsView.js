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
      _calculator,
      _collectionView,
      _errorReportEl,
      _newButton,

      _hasIncompleteCalculation,
      _createNewAnalysis,
      _onNewClick,
      _onAnalysisRemove,
      _removeErrorReporting,
      _validateCalculation;

  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function () {
    var toggleText;

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
    _calculateButton.addEventListener('click', _validateCalculation);

    _newButton = _this.el.querySelector('.actions-view-new');
    _newButton.addEventListener('click', _onNewClick);

    // Clear error reporting when the current model in deselected
    _this.collection.on('deselect', _removeErrorReporting);

    // Create a new calculation when the last is removed
    _this.collection.on('remove', _onAnalysisRemove);
  };

  /**
   * Called when the "new" button is clicked, if the current analysis model
   * passes validation then a new analysis model is generated
   */
  _onNewClick = function () {
    _createNewAnalysis();
    _newButton.setAttribute('disabled', true);
  };

  _onAnalysisRemove = function () {
    _hasIncompleteCalculation();

    if (_this.collection.data().length === 0) {
      _createNewAnalysis();
      _newButton.setAttribute('disabled', true);
    }
  };

  /**
   * Checks for an incomplete calculation in the collection.
   * If all calculations have been made, it enables the 'new' button,
   * so that the user can create a new calculation.
   */
  _hasIncompleteCalculation = function () {
    var analyses = [],
        i;

    analyses = _this.collection.data();

    // check for an incomplete calculation in the collection
    for (i = 0; i < analyses.length; i++) {
      if (!analyses[i].get('data')) {
        return;
      }
    }

    // enable the 'new' button
    _newButton.removeAttribute('disabled');
  };

  _createNewAnalysis = function () {
    var analysis = Analysis();
    _this.collection.add(analysis);
    _this.collection.select(analysis);
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
   * Validates the currently selected Analysis model. Checks if all
   * of the required parameters are set to perform a calculation.
   */
  _validateCalculation = function () {
    var errors,
        model;

    errors = [];

    if (_this.model) {
      model = _this.model.get();

      // validate Edition
      if (!model.edition) {
        errors.push('<li>Please select an Edition.</li>');
      }

      // // Location & Region
      // if (!model.location || !model.region) {
      //   errors.push('<li>Please select a Location.</li>');
      // }

      // validate Location & Region
      if (!model.latitude || !model.longitude || !model.region) {
        errors.push('<li>Please select a Location.</li>');
      }

      // validate Site Class
      if (!model.vs30) {
        errors.push('<li>Please select a Site Class.</li>');
      }
    }

    if (errors.length === 0) {
      _removeErrorReporting();
    } else {
      _errorReportEl.classList.add('alert');
      _errorReportEl.classList.add('error');
      _errorReportEl.innerHTML = '<b>The following parameters must ' +
          'be selected before performing a calculation:</b>' +
          '<ul>' + errors.join('') + '</ul>';
    }
  };

  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {

    _this.collection.off('deselect', _removeErrorReporting);

    _hasIncompleteCalculation = null;
    _createNewAnalysis = null;
    _onNewClick = null;
    _onAnalysisRemove = null;
    _removeErrorReporting = null;
    _validateCalculation = null;

    _accordion = null;
    _calculateButton = null;
    _calculator = null;
    _collectionView = null;
    _errorReportEl = null;
    _newButton = null;
    _this = null;
    _initialize = null;

  }, _this.destroy);

  /**
   * Called on model change, checks to see if all calculations are complete
   * @param  {[type]} changes [description]
   * @return {[type]}         [description]
   */
  _this.render = function (changes) {
    // check if Analysis.get('data') was updated
    if (typeof changes !== 'undefined' && changes.hasOwnProperty('data')) {
      // if data check all models in the collection
      if(_this.model.get('data')) {
        _hasIncompleteCalculation();
      }
    }
  };

  _initialize();
  params = null;
  return _this;

};

module.exports = ActionsView;
