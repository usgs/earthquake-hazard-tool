'use strict';

var View = require('mvc/View'),
    Util = require('util/Util');


var _DEFAULTS = {
  horizons: [
    {
      id: '2P50',
      value: 2475,
      display: '2% in 50 years<small>(2,475 years)</small>',
      displayOrider: 0
    },
    {
      id: '10P50',
      value: 475,
      display: '10% in 50 years<small>(475 years)</small>',
      displayOrider: 1
    }
  ]
};


var TimeHorizonInput = function (params) {
  var _this,
      _initialize,

      _buttons,
      _horizons,
      _timeHorizonButtons, // button group wrapper
      _yearsInput,

      _createButtonMarkup,
      _createViewSkeleton,
      _onTimeHorizonButtonClick,
      _onYearsInputChange;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function (/*params*/) {
    _horizons = params.horizons;

    _createViewSkeleton();

    _yearsInput = _this.el.querySelector('.input-time-horizon-years');
    _timeHorizonButtons = _this.el.querySelector('.input-time-horizon-buttons');
    _buttons = _timeHorizonButtons.querySelectorAll('button');

    _yearsInput.addEventListener('change', _onYearsInputChange);
    _timeHorizonButtons.addEventListener('click', _onTimeHorizonButtonClick);
    _this.render();
  };


  /**
   * @param timeHorizon {Object}
   *      An object with "id", "value", "display", and "displayOrder" keys.
   *
   *
   * @return {String}
   *      Markup for the button.
   */
  _createButtonMarkup = function (timeHorizon) {
    var currentValue;

    currentValue = _this.model.get('timeHorizon');

    return [
      '<button ',
          'class="input-time-horizon-button" ',
          'value="', timeHorizon.value, '">',
        timeHorizon.display,
      '</button>'
    ].join('');
  };

  _createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<label>',
        'Time Horizon',
        '<small class="input-help">Return period in years</small>',
        '<input type="text" class="input-time-horizon-years"/>',
        '<div class="input-time-horizon-buttons button-group">',
          _horizons.map(_createButtonMarkup).join(''),
        '</div>',
      '</label>'
    ].join('');
  };

  _onTimeHorizonButtonClick = function (evt) {
    var target,
        value;

    target = Util.getParentNode(evt.target, 'BUTTON', _this.el);

    if (!target || target.nodeName.toUpperCase() !== 'BUTTON') {
      return;
    }

    value = parseInt(target.value, 10);

    if (!isNaN(value)) {
      _this.model.set({
        timeHorizon: value
      });
    }

    return evt.preventDefault();
  };

  _onYearsInputChange = function () {
    var value;

    value = parseInt(_yearsInput.value, 10);

    if (_this.model && !isNaN(value)) {
      _this.model.set({
        timeHorizon: value
      });
    }
  };


  _this.destroy = Util.compose(function () {
    _timeHorizonButtons.removeEventListener('click', _onTimeHorizonButtonClick);
    // TODO
  }, _this.destroy);

  _this.render = function () {
    var value;

    value = '';

    if (_this.model) {
      value = _this.model.get('timeHorizon');
    } else {
      value = '';
    }

    // Set input field
    _yearsInput.value = value;

    // Highlight corresponding button, if exists
    Array.prototype.forEach.call(_buttons, function (button) {
      if (parseInt(button.value, 10) === value) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = TimeHorizonInput;
