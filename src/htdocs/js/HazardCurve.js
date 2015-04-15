'use strict';

var Model = require('mvc/Model'),

    Util = require('util/Util');


var HazardCurve = function (params) {
  var _this;

  _this = Model(Util.extend({
    label: 'Hazard Curve',
    data: []
  }, params));


  params = null;
  return _this;
};

module.exports = HazardCurve;
