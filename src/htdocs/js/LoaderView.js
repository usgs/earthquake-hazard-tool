'use strict';


var View = require('mvc/View'),
    Util = require('util/Util');


var LoaderView = function() {
  var _this,
      _initialize,

      _showCount,

      _isVisible;


  _this = View();

  _initialize = function () {
    _showCount = 0;

    _this.el.className = 'loader-mask';
    _this.el.innerHTML = '<div class="loader-container">' +
        '<div class="loader"></div>' +
        '<p class="loader-text">Calculating</p>' +
      '</div>';
  };


  _isVisible = function () {
    return _this.el.parentNode;
  };


  _this.show = function () {
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

  _this.destroy = Util.compose(function () {
    _isVisible = null;

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
