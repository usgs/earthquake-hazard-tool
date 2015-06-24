'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');


var Meta = function (options) {
  var _this,
      _initialize;


  _this = Model(Util.extend({
    id: null,
    value: null,
    display: null,
    displayorder: null,
    supports: null
  }, options));


  _initialize = function (/*options*/) {
    // Use the value as the ID
    if (_this.get('value') !== null) {
      _this.set({id: _this.get('value')});
    }
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = Meta;
