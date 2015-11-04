'use strict';


var Model = require('mvc/Model'),
    Util = require('util/Util');


// Default values to be used by constructor
var _DEFAULTS = {
  component: '', // String - GMPE Name or "Total"
  data: []       // Array - Hazard contirbution bins
                 //         Each bin has "m", "r", and "εdata" attributes
};

var _DEAGG_ID = 0;


/**
 * Class: Deaggregation
 *
 * @param params {Object}
 *      Configuration options. See _DEFAULTS for more details.
 */
var Deaggregation = function (params) {
  var _this;


  params = Util.extend({}, params, {id: 'deagg-' + (_DEAGG_ID++)}, _DEFAULTS);
  _this = Model(params);


  params = null;
  return _this;
};


module.exports = Deaggregation;
