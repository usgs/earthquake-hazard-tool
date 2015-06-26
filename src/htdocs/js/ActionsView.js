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

      _onCalculateClick,
      _onNewClick,
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
    _calculateButton.addEventListener('click', _onCalculateClick);

    _newButton = _this.el.querySelector('.actions-view-new');
    _newButton.addEventListener('click', _onNewClick);

    // Clear error reporting when the current model in deselected
    _this.collection.on('deselect', _removeErrorReporting);
  };


  /**
   * Called when the "calculate button" is clicked
   */
  _onCalculateClick = function () {
    var text;

    text = 'The following parameters must be selected before ' +
        'performing a calculation:';

    _validateCalculation(text);
  };

  /**
   * Called when the "new" button is clicked, if the current analysis model
   * passes validation then a new analysis model is generated
   */
  _onNewClick = function () {
    var text;

    text = 'The following parameters must be selected on the current ' +
        'calculation before performing a new calculation:';

    if (_validateCalculation(text)) {
      var analysis = Analysis();
      _this.collection.add(analysis);
      _this.collection.select(analysis);
    }
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
   * Validates the currently selected Analysis model.
   * Checks if all of the required parameters are set
   * to perform a calculation.
   *
   * @param  action {String}
   *         Text that is added to the error output to
   *         provide context for the error.
   *
   * @return {Boolean} returns true if the Analysis model
   *         validates, and false if it doesn't
   */
  _validateCalculation = function (helpText) {
    var errors,
        isValid,
        model;

    errors = [];
    isValid = true;

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
      _errorReportEl.innerHTML = '<b>' + helpText + '</b>' +
          '<ul>' + errors.join('') + '</ul>';
      isValid = false;
    }

    return isValid;
  };

  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {

    _this.collection.off('deselect', _removeErrorReporting);

    _onCalculateClick = null;
    _onNewClick = null;
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

  _this.render = function () {

  };

  _initialize();
  params = null;
  return _this;

};

module.exports = ActionsView;
