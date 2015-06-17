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
      '<form>' +
        '<label for="timeHorizonInput">Time Horizon: </label>' +
        '<input type="text" id="timeHorizonInput"/>';
    _timeHorizonInput = _this.el.querySelector('#timeHorizonInput');
    _timeHorizonInput.addEventListener('blur', _updateTimeHorizon);
    _this.render();
  };

  // Updates timeHorizon on the model
  _updateTimeHorizon = function () {
    if (_this.model) {
      _this.model.set({
        'timeHorizon': _this.collection.getSelected()
      },
      {
        'silent': true
      });
    }
  };

  _this.render = function () {
    var timeHorizon;

    if (_this.model) {
      timeHorizon = _this.model.get('timeHorizon');
      _timeHorizonInput.value = timeHorizon;
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