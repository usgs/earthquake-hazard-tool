'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),

    Util = require('util/Util');


var HazardCurve = function (params) {
  var _this;

  _this = Model(Util.extend({
    label: null,
    data: Collection([])
  }, params));


  params = null;
  return _this;
};

module.exports = HazardCurve;
