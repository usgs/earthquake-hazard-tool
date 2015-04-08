'use strict';

var View = require('mvc/View'),
    TabList = require('tablist/TabList');

var RETINA_USGS_LOGO = 'data:image/png;base64,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';

var ApplicationView = function (options) {
  var _this,
      _initialize,

      // variables
      _el,
      _tabList,
      _toggleButton,

      // methods
      _toggleOffCanvas;

  _this = View(options);

  _initialize = function () {
    _el = _this.el;
    _el.className = 'application-container';
    _el.innerHTML = '<header class="application-header">' +
          '<a href="/" class="site-logo">' +
            '<img alt="USGS" src="' + RETINA_USGS_LOGO + '"/>' +
          '</a>' +
          '<button class="offcanvas-toggle">menu</button>' +
        '</header>' + 
        '<section class="application-content">' +
          '<section class="offcanvas-content"><p>offcanvas-content</p></section>' +
          '<section class="main-content"></section>' +
        '</section>';

    _toggleButton = _el.querySelector('.offcanvas-toggle');
    _toggleButton.addEventListener('click', _toggleOffCanvas);

    _tabList = TabList({
      el: _el.querySelector('.main-content'),
      tabs: [
        {
          title: 'Content',
          content: '<p>This is so tab panel content</p>'
        }
      ]
    });

    options = null;
  };

  _toggleOffCanvas = function () {
    var container = _el.querySelector('.application-content');

    if (!container) {
      return;
    }

    if (container.classList.contains('offcanvas-enabled')) {
      container.classList.remove('offcanvas-enabled');
    } else {
      container.classList.add('offcanvas-enabled');
    }
  };

  _this.destroy = function () {
    // events
    _toggleButton.removeEventListener('click', _toggleOffCanvas);

    // variables
    _el = null;
    _toggleButton = null;

    // methods
    _toggleOffCanvas = null;
  };

  _initialize();
  return _this;
};

module.exports = ApplicationView;