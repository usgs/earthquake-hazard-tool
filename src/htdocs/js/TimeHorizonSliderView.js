'use strict';

var SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');

var TIME_HORIZONS = [
  {
    'id': 2475,
    'value': 2475,
    'display': '2% in 50 years',
    'displayorder': 0
  },
  {
    'id': 475,
    'value': 475,
    'display': '10% in 50 years',
    'displayorder': 1
  }
];

/**
 * Displays a collection of Time Horizons in a collection select box,
 * The collection of time horizons updates when the selected analysis
 * in the collection of analyses changes.
 *
 * timeHorizonSelectView({
 *   el: document.createElement('div'),
 *   collection: Collection([Analysis])
 * });
 *
 * @param {[type]} params [description]
 */
var timeHorizonSelectView = function (params) {

  var _this,
      _initialize,

      _timeHorizonSlider,

      _setSliderValue,
      _updateTimeHorizon;

  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function () {
    var options,
        optionEls = [],
        i;

    options = TIME_HORIZONS;

    for(i = 0; i < options.length; i++) {
      optionEls.push('<option>' + options[i].value + '</option>');
    }

    _this.el.innerHTML =
      '<label for="slider" class="time-horizon-slider-label">' +
          'Time Horizon</label>' +
      '<input type="range" id="slider" class="time-horizon-slider"' +
          'min="0" max="5000" value="2475" step="100" orient="vertical list="years">' +
      '<datalist id="years">' +
        optionEls.join('') +
      '</datalist>';

    _timeHorizonSlider = _this.el.querySelector('#slider');

    // bind to select on the Site Class collection
    _timeHorizonSlider.addEventListener('blur', _updateTimeHorizon);

    _this.render();
  };

  /**
   * update the currently selected Analysis model with
   * the currently selected Site Class in the CollectionSelectBox.
   */
  _updateTimeHorizon = function () {
    if (_this.model) {
      // set the value of the selected item in _timeHorizonCollection
      _this.model.set({'timeHorizon': _timeHorizonSlider.value});
    }
  };

  /**
   * Set the value for the range input
   *
   * @param timeHorizon {Number}
   *        The time horizon value to set on the slider
   */
  _setSliderValue = function (timeHorizon) {
    _timeHorizonSlider.value = timeHorizon;
  };

  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {
    // unbind
    _timeHorizonSlider.removeEventListener('blur', _updateTimeHorizon);
    // methods
    _setSliderValue = null;
    _updateTimeHorizon = null;
    // variables
    _timeHorizonSlider = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);

  /**
   * render the selected time horizon, or the blank option
   */
  _this.render = function () {
    var timeHorizon;

    // Update selected time horizon when collection changes
    if (_this.model) {
      timeHorizon = _this.model.get('timeHorizon');
      // this shouldn't happen, but use the default
      if (timeHorizon === null) {
        _setSliderValue(2475);
      } else {
        _setSliderValue(timeHorizon);
      }
    } else {
      // no item in the collection has been selected
      _setSliderValue(2475);
    }
  };

  _initialize(params);
  params = null;
  return _this;

};

module.exports = timeHorizonSelectView;