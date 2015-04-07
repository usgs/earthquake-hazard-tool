'use strict';

var View = require('mvc/View');

var ApplicationView = function (options) {
  var _this,
      _initialize;

  _this = View(options);

  _initialize = function () {
    var el = _this.el;

    el.className = 'application-container';
    el.innerHTML = '<header class="application-header">'+
          '<img src="" />' +
          '<button>Menu</button>' +
        '</header>' + 
        '<section class="application-content">' +
          '<section class="offcanvas-content"></section>' +
          '<section class="main-content"></section>' +
        '</section>';

    options = null;
  };

  _initialize();
  return _this;
};

module.exports = ApplicationView;