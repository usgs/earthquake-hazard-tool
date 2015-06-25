'use strict';

var ModalView = require('mvc/ModalView'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    TimeHorizonSliderView = require('TimeHorizonSliderView'),
    Util = require('util/Util');

var TimeHorizonInputView = function (params) {
  var _this,
      _initialize,

      _modal,
      _sliderView,
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

    div.innerHTML = 'Time Horizon value must be between 0 and 5,000.';
    _sliderView = TimeHorizonSliderView({
      el: div,
      collection: _this.collection
    });

    _modal = ModalView(div, {
      title: 'Validation error',
      classes: ['modal-error'],
      buttons: [
        {
          callback: function () {
            _modal.hide();
          },
          classes: ['okButton'],
          text: 'ok'
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
    _sliderView = null;
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
