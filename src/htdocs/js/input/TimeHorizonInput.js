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
      id: '5P50',
      value: 975,
      display: '5% in 50 years<small>(975 years)</small>',
      displayorder: 1
    },
    {
      id: '10P50',
      value: 475,
      display: '10% in 50 years<small>(475 years)</small>',
      displayOrider: 2
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
      _yearsLabel,

      _createButtonMarkup,
      _createViewSkeleton,
      _onTimeHorizonButtonClick,
      _onYearsInputChange,
      _setErrorState;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function (/*params*/) {
    _horizons = params.horizons;

    _createViewSkeleton();

    _yearsLabel = _this.el.querySelector('label');
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
        '<small class="usa-input-error-message">',
          'Time horizon must be between 0 and 10,000 years.',
        '</small>',
        '<div class="input-time-horizon-buttons button-group">',
          _horizons.map(_createButtonMarkup).join(''),
        '</div>',
      '</label>'
    ].join('');

    _this.el.classList.add('time-horizon-input');
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
      // Limit time-horizon input to [0 .. 10000] years
      if (value < 0 || value > 10000) {
        // Value is out of range, use `null` to clear it
        value = null;
      }

      _this.model.set({
        timeHorizon: value
      });
    }
  };

  _setErrorState = function (show) {
    if (show) {
      _this.el.classList.add('usa-input-error');
      _yearsLabel.classList.add('usa-input-error-label');
    } else {
      _this.el.classList.remove('usa-input-error');
      _yearsLabel.classList.remove('usa-input-error-label');
    }
  };


  _this.destroy = Util.compose(function () {
    _yearsInput.removeEventListener('change', _onYearsInputChange);
    _timeHorizonButtons.removeEventListener('click', _onTimeHorizonButtonClick);

    _createButtonMarkup = null;
    _createViewSkeleton = null;
    _onTimeHorizonButtonClick = null;
    _onYearsInputChange = null;

    _initialize = null;
    _this = null;
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
    if (value !== null) {
      _yearsInput.value = value;
    }

    // Highlight corresponding button, if exists
    Array.prototype.forEach.call(_buttons, function (button) {
      if (parseInt(button.value, 10) === value) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });

    // Set appropriate error state based on current value
    value = parseInt(value, 10); // null --> NaN, '' --> NaN
    _setErrorState(
      isNaN(value) ||
      value < 0 ||
      value > 10000
    );
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = TimeHorizonInput;
