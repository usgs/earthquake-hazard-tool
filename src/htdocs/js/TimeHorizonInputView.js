'use strict';

var SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');

var TimeHorizonInputView = function (params) {
  var _this,
      _initialize,

      _errorsView,
      _timeHorizonInput,

      _updateTimeHorizon,
      _validateTimeHorizon;

  _this = SelectedCollectionView(params);

  _initialize = function (params) {

    _errorsView = params.errorsView;

    _this.el.innerHTML =
        '<label for="basic-time-horizon-view">Time Horizon</label>' +
        '<small class="help">Return period in years</small>' +
        '<input type="text" id="basic-time-horizon-view"/>';

    _timeHorizonInput = _this.el.querySelector('#basic-time-horizon-view');
    _timeHorizonInput.addEventListener('change', _validateTimeHorizon);
    _errorsView.on('validate', _validateTimeHorizon);

    _this.render();
  };


  // Updates timeHorizon on the model
  _updateTimeHorizon = function () {
    var timeHorizonInputValue;

    if (_this.model) {
      if (_timeHorizonInput.value) {
        timeHorizonInputValue = parseInt(_timeHorizonInput.value, 10);
        if (timeHorizonInputValue >= 1 && timeHorizonInputValue <= 5000) {
          _this.model.set({
            'timeHorizon': timeHorizonInputValue
          });
        } else {
          _this.model.set({
            'timeHorizon': null
          });
        }
      }
      _timeHorizonInput.focus();

    }
  };


  /**
   * Validate the Time Horizon value. Ensure that a value is selected
   * and that the Time Horizon value is inside the allowed range.
   *
   * Update Time Horizon on the model to null when it does not pass validation.
   */
  _validateTimeHorizon = function () {
    var timeHorizonInputValue;

    if (_this.model) {
      if (_timeHorizonInput.value) {
        timeHorizonInputValue = parseInt(_timeHorizonInput.value, 10);
        if (timeHorizonInputValue >= 1 && timeHorizonInputValue <= 5000) {
          _errorsView.removeErrors({
            'input': 'timeHorizon'
          });
          _timeHorizonInput.className = '';
          _updateTimeHorizon(timeHorizonInputValue);
        } else {
          _timeHorizonInput.className = 'error';
          _errorsView.addErrors({
            'input': 'timeHorizon',
            'messages': [
              'Invalid Time Horizon value. Valid values are between ' +
              '1 and 5000 years.'
            ]
          });
          _updateTimeHorizon(null);
        }
      }
    }
  };

  _this.render = function () {
    if (_this.model) {
      _timeHorizonInput.value = _this.model.get('timeHorizon');
      _validateTimeHorizon();
    }
  };

  // Destroy all the things
  _this.destroy = Util.compose(function () {
    _timeHorizonInput.removeEventListener('change', _updateTimeHorizon);

    _initialize = null;
    _this = null;
    _timeHorizonInput = null;
    _updateTimeHorizon = null;
    _validateTimeHorizon = null;
  }, _this.destroy);

  _initialize(params);
  params = null;
  return _this;
};

module.exports = TimeHorizonInputView;
