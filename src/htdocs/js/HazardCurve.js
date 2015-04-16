'use strict';

var Model = require('mvc/Model'),

    Util = require('util/Util');

var i = 0;

var HazardCurve = function (params) {
  var _this;

  _this = Model(Util.extend({
    id: 'curve-' + i++,
    label: 'Hazard Curve',
    data: []
  }, params));


  params = null;
  return _this;
};

module.exports = HazardCurve;
