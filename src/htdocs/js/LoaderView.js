'use strict';


var View = require('mvc/View'),
    Util = require('util/Util');


var LoaderView = function() {
  var _this,
      _initialize,

      _cancelButton,
      _request,
      _showCount,

      _isVisible;


  _this = View();

  _initialize = function () {
    _showCount = 0;

    _this.el.className = 'loader-mask';
    _this.el.innerHTML = '<div class="loader-container">' +
        '<div class="loader"></div>' +
        '<p class="loader-text">Calculating</p>' +
        '<button class="cancel-request">Cancel Request</button>' +
      '</div>';

    _cancelButton = _this.el.querySelector('.cancel-request');
    _cancelButton.addEventListener('click', _this.cancel, _this);
  };


  _isVisible = function () {
    return _this.el.parentNode;
  };


  _this.show = function (request) {
    if (request) {
      _request = request;
    }

    if (_showCount === 0) {
      document.body.appendChild(_this.el);
    }

    _showCount += 1;
  };

  _this.hide = function () {
    _showCount -= 1;

    if (_showCount < 0) {
      _showCount = 0;
    }

    if (_showCount === 0 && _isVisible()) {
      _this.el.parentNode.removeChild(_this.el);
    }
  };

  _this.cancel = function () {
    // cancel XHR request
    if (_request) {
      _request.abort();
      _request = null;
    }

    // close spinner
    _this.hide();
  };

  _this.destroy = Util.compose(function () {

    _cancelButton.removeEventListener('click', _this.cancel, _this);

    _isVisible = null;

    _cancelButton = null;
    _request = null;
    _showCount = null;

    _this = null;
    _initialize = null;
  }, _this.destroy);


  _initialize();
  return _this;
};


var _INSTANCE = LoaderView();


module.exports = function () {
  return _INSTANCE;
};
