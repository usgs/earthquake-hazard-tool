'use strict';

var ApplicationView = require('ApplicationView'),

    Util = require('util/Util');

Util.detach(document.querySelector('noscript'));

ApplicationView({
  el: document.getElementById('application')
});
