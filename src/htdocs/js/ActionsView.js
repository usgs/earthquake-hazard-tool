'use strict';

var Analysis = require('Analysis'),
    AnalysisCollectionView = require('AnalysisCollectionView'),

    Accordion = require('accordion/Accordion'),

    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');


var EditionView = function (params) {

  var _this,
      _initialize,

      _accordion,
      _calculateButton,
      _calculator,
      _collectionView,
      _errorReportEl,
      _saveButton,

      _onCalculateClick,
      _onSaveClick,
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
      '<button class="actions-view-save">Save</button>'
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

    _saveButton = _this.el.querySelector('.actions-view-save');
    _saveButton.addEventListener('click', _onSaveClick);

    // Clear error reporting when the current model in deselected
    _this.collection.on('deselect', _removeErrorReporting);
  };


  // check if current model is valid
  _onCalculateClick = function () {
    _validateCalculation('calculating');
  };

    // check if current model is valid
  _onSaveClick = function () {
    if (_validateCalculation('saving')) {
      var analysis = Analysis();
      _this.collection.add(analysis);
      _this.collection.select(analysis);
    }
  };

  _removeErrorReporting = function () {
    _errorReportEl.innerHTML = '';
    _errorReportEl.classList.remove('error');
    _errorReportEl.classList.remove('alert');
  };

  _validateCalculation = function (action) {
    var errors,
        isValid,
        model;

    errors = [];
    isValid = true;

    if (_this.model) {
      model = _this.model.get();

      if (!model.edition) {
        errors.push('<li>Please select an Edition.</li>');
      }

      // // Location & Region
      // if (!model.location || !model.region) {
      //   errors.push('<li>Please select a Location.</li>');
      // }

      // Location & Region
      if (!model.latitude || !model.longitude || !model.region) {
        errors.push('<li>Please select a Location.</li>');
      }

      // Site Class
      if (!model.vs30) {
        errors.push('<li>Please select a Site Class.</li>');
      }
    }

    if (errors.length === 0) {
      _removeErrorReporting();
    } else {
      _errorReportEl.classList.add('alert');
      _errorReportEl.classList.add('error');
      _errorReportEl.innerHTML = '<b>The following parameters must be ' +
          'selected before ' + action + ':</b>' +
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
    _onSaveClick = null;
    _removeErrorReporting = null;
    _validateCalculation = null;

    _accordion = null;
    _calculateButton = null;
    _calculator = null;
    _collectionView = null;
    _errorReportEl = null;
    _saveButton = null;
    _this = null;
    _initialize = null;

  }, _this.destroy);

  _this.render = function () {

  };


  _initialize();
  params = null;
  return _this;

};

module.exports = EditionView;
