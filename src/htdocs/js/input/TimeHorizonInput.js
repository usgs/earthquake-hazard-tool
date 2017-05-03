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
      _initialize;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function (/*params*/) {
    _this.horizons = params.horizons;

    _this.createViewSkeleton();

    _this.yearsLabel = _this.el.querySelector('label');
    _this.yearsInput = _this.el.querySelector('.input-time-horizon-years');
    _this.timeHorizonButtons = _this.el.querySelector(
        '.input-time-horizon-buttons');
    _this.buttons = _this.timeHorizonButtons.querySelectorAll('button');

    _this.yearsInput.addEventListener('change', _this.onYearsInputChange);
    _this.timeHorizonButtons.addEventListener('click',
        _this.onTimeHorizonButtonClick);
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
  _this.createButtonMarkup = function (timeHorizon) {
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

  _this.createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<label>',
        'Time Horizon',
        '<small class="input-help">Return period in years</small>',
        '<input type="text" class="input-time-horizon-years"/>',
        '<small class="usa-input-error-message">',
          'Time horizon must be between 0 and 10,000 years.',
        '</small>',
        '<div class="input-time-horizon-buttons button-group">',
          _this.horizons.map(_this.createButtonMarkup).join(''),
        '</div>',
      '</label>'
    ].join('');

    _this.el.classList.add('time-horizon-input');
  };

  _this.onTimeHorizonButtonClick = function (evt) {
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

  _this.onYearsInputChange = function () {
    var value;

    value = parseInt(_this.yearsInput.value, 10);

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
      _this.yearsInput.value = value;
    }

    // Highlight corresponding button, if exists
    Array.prototype.forEach.call(_this.buttons, function (button) {
      if (parseInt(button.value, 10) === value) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });

    // Set appropriate error state based on current value
    value = parseInt(value, 10); // null --> NaN, '' --> NaN
    _this.setErrorState(
      isNaN(value) ||
      value < 0 ||
      value > 10000
    );
  };

  _this.setErrorState = function (show) {
    if (show) {
      _this.el.classList.add('usa-input-error');
      _this.yearsLabel.classList.add('usa-input-error-label');
    } else {
      _this.el.classList.remove('usa-input-error');
      _this.yearsLabel.classList.remove('usa-input-error-label');
    }
  };


  _this.destroy = Util.compose(function () {
    _this.yearsInput.removeEventListener('change', _this.onYearsInputChange);
    _this.timeHorizonButtons.removeEventListener('click',
        _this.onTimeHorizonButtonClick);

    _this.createButtonMarkup = null;
    _this.createViewSkeleton = null;
    _this.onTimeHorizonButtonClick = null;
    _this.onYearsInputChange = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);


  _initialize(params);
  params = null;
  return _this;
};


module.exports = TimeHorizonInput;
