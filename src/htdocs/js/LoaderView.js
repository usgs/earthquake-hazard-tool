'use strict';

var View = require('mvc/View'),
    Util = require('util/Util');

var LoaderView = function(params) {

  var _this,
      _initialize,

      _isVisible;

  _this = View(params);

  _initialize = function () {
    _this.el = document.createElement('div');
    _this.el.className = 'loader-mask';
    _this.el.innerHTML = '<div class="loader-container">' +
        '<div class="loader"></div>' +
        '<p class="loader-text">Calculating</p>' +
        '</div>';
  };

  _isVisible = function () {
    return document.querySelector('.loader-mask');
  };

  _this.show = function () {
    document.body.appendChild(_this.el);
  };

  _this.hide = function () {
    if (_isVisible) {
      document.body.removeChild(_this.el);
    }
  };
 
  _this.destroy = Util.compose(function () {
    _this = null;
    _initialize = null;

    _isVisible = null;
  }, _this.destroy);

  _initialize();
  params = null;
  return _this;

};

module.exports = LoaderView;
