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
    _this.el.innerHTML =
        '<label for="timeHorizonInput">Time Horizon</label>' +
        '<small class="help">Return period in years</small>' +
        '<input type="text" class="timeHorizonInput"/>';
    _timeHorizonInput = _this.el.querySelector('.timeHorizonInput');
    _timeHorizonInput.addEventListener('blur', _updateTimeHorizon);
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
         _this.show();
        }
      }
    }
  };

  _this.hide = function () {
    _modal.hide();
  };

  _this.show = function () {


    _modal = ModalView(_this.el, {
      title: 'Validation error',
      message: 'Time Horizon value must be between 0 and 5,000',
      buttons: [
        {
          callback: function () {
            _modal.hide();
          },
          text: 'ok'
        }
      ]
    });

    //_modal.show();
  };

  _this.render = function () {
    if (_this.model) {
      _timeHorizonInput.value = _this.model.get('timeHorizon');
    }
  };

  // Destroy all the things
  _this.destroy = Util.compose(function () {
    _timeHorizonInput.removeEventListener('blur', _updateTimeHorizon);
    _initialize = null;
    _this = null;
    _timeHorizonInput = null;
  }, _this.destroy);

  _initialize();
  params = null;
  return _this;
};

module.exports = TimeHorizonInputView;
