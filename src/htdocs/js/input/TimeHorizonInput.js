'use strict';

var View = require('mvc/View'),
    Util = require('util/Util');


var _DEFAULTS = {

};


var TimeHorizonInput = function (params) {
  var _this,
      _initialize;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function (/*params*/) {

  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = TimeHorizonInput;
