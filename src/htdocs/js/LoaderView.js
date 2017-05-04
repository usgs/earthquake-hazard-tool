'use strict';


var View = require('mvc/View'),
    Util = require('util/Util');


/**
 * View to show user that data is being loaded,
 * and allow request to be cancelled.
 */
var LoaderView = function() {
  var _this,
      _initialize;


  _this = View();

  _initialize = function () {
    _this.showCount = 0;

    _this.el.className = 'loader-mask';
    _this.el.innerHTML = '<div class="loader-container">' +
        '<div class="loader"></div>' +
        '<p class="loader-text">Calculating</p>' +
        '<button class="cancel-request">Cancel Request</button>' +
      '</div>';

    _this.cancelButton = _this.el.querySelector('.cancel-request');
    _this.cancelButton.addEventListener('click', _this.cancel);
  };


  /**
   * Check whether view is attached to DOM.
   *
   * @return {Boolean}
   *         true when view element has parent node,
   *         false otherwise.
   */
  _this.isVisible = function () {
    return _this.el.parentNode;
  };


  /**
   * Show the loading view.
   */
  _this.show = function (request) {
    if (request) {
      _this.request = request;
    }

    if (_this.showCount === 0) {
      document.querySelector('body').appendChild(_this.el);
    }

    _this.showCount += 1;
  };

  /**
   * Hide the loading view.
   */
  _this.hide = function () {
    _this.showCount -= 1;

    if (_this.showCount < 0) {
      _this.showCount = 0;
    }

    if (_this.showCount === 0 && _this.isVisible()) {
      _this.el.parentNode.removeChild(_this.el);
    }
  };

  /**
   * Cancel any active request and hide the view.
   */
  _this.cancel = function () {
    // cancel XHR request
    if (_this.request) {
      _this.request.abort();
      _this.request = null;
    }

    // close spinner
    _this.hide();
  };

  /**
   * Destroy the view.
   */
  _this.destroy = Util.compose(function () {
    if (!_this) {
      return;
    }

    _this.cancelButton.removeEventListener('click', _this.cancel);

    _this = null;
    _initialize = null;
  }, _this.destroy);


  _initialize();
  return _this;
};


var _INSTANCE;

module.exports = function () {
  if (!_INSTANCE) {
     _INSTANCE = LoaderView();
  }
  return _INSTANCE;
};
