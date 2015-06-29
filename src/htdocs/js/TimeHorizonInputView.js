'use strict';

var ModalView = require('mvc/ModalView'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');

var TimeHorizonInputView = function (params) {
  var _this,
      _initialize,

      _modal,
      _timeHorizonInput,

      _updateTimeHorizon;

  _this = SelectedCollectionView(params);

  _initialize = function () {
    var div;

    _this.el.innerHTML =
        '<label for="timeHorizonInput">Time Horizon</label>' +
        '<small class="help">Return period in years</small>' +
        '<input type="text" class="timeHorizonInput"/>';
    _timeHorizonInput = _this.el.querySelector('.timeHorizonInput');
    _timeHorizonInput.addEventListener('change', _updateTimeHorizon);
    div = document.createElement('div');

    div.innerHTML =
        '<p class="error alert">' +
          'Time Horizon value must be between 1 and 5,000 inclusive. ' +
          'Click 2% in 50 years or 10% in 50 years to add either ' +
          'selected value to the Time Horizon Input Box. Cancel returns ' +
          'without changing the time horizon value.' +
        '</p>' +
        '<div class="slider-view"></div>';

    _modal = ModalView(div, {
      title: 'Validation error',
      classes: ['modal-error'],
      buttons: [
        {
          callback: function () {
            _this.model.set({'timeHorizon': 2475}, {'force': true});
          },
          text: '2% in 50 years'
        },
        {
          callback: function () {
            _this.model.set({'timeHorizon': 475}, {'force': true});
          },
          text: '10% in 50 years'
        },
        {
          callback: function () {
            _modal.hide();
          },
          text: 'Cancel'
        }
      ]
    });
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
          return;
        }
      }
      _timeHorizonInput.classList.add('error');
      _timeHorizonInput.focus();
      _modal.show();
    }
  };

  _this.render = function () {
    if (_this.model) {
      _timeHorizonInput.value = _this.model.get('timeHorizon');
      _timeHorizonInput.classList.remove('error');
    }

    if (_modal) {
      _modal.hide();
    }
  };

  // Destroy all the things
  _this.destroy = Util.compose(function () {
    _timeHorizonInput.removeEventListener('change', _updateTimeHorizon);

    _modal = null;
    // _sliderView = null;
    _initialize = null;
    _this = null;
    _timeHorizonInput = null;
    _updateTimeHorizon = null;
  }, _this.destroy);

  _initialize();
  params = null;
  return _this;
};

module.exports = TimeHorizonInputView;
