'use strict';

var SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');

var TimeHorizonInputView = function (params) {
  var _this,
      _initialize,

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
    if (_this.model) {
      if (_timeHorizonInput.value === '') {
        _this.model.set({
          'timeHorizon': null
        });
      } else {
        _this.model.set({
          'timeHorizon': parseInt(_timeHorizonInput.value, 10)
        });
      }
    }
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
