'use strict';


var Deaggregation = require('deagg/Deaggregation'),

    Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),

    Util = require('util/Util');


// Default values to be used by constructor
var _DEFAULTS = {
  metadata: {
    imt: {value: 'Unknown'},
    rlabel: 'Distance',
    mlabel: 'Magnitude',
    εlabel: 'Contribution',
    εbins: []
  },
  data: []
};

var _DEAGG_ID = 0;


/**
 * Class: DeaggResponse
 *
 * @param params {Object}
 *      Configuration options. See _DEFAULTS for more details.
 */
var DeaggResponse = function (params) {
  var _this,
      _initialize;


  // Inherit from parent class
  _this = Model();

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    var attributes,
        deaggs,
        metadata;

    params = Util.extend({}, _DEFAULTS,
        {id: 'deagg-response-' + (_DEAGG_ID++)}, params);

    metadata = params.metadata;
    deaggs = params.data.map(function (deagg) {
      return Deaggregation(Util.extend({
        metadata: metadata,
      }, deagg));
    });

    attributes = {
      imt: metadata.imt.value,
      rlabel: metadata.rlabel,
      mlabel: metadata.mlabel,
      εlabel: metadata.εlabel,
      εbins: metadata.εbins,
      deaggregations: Collection(deaggs)
    };

    // Should not have listeners yet, but silent anyway to short-circuit check
    _this.set(attributes, {silent: true});
  };


  _this.destroy = Util.compose(function () {
    var deaggs;

    deaggs = _this.get('deaggregations');
    deaggs.destroy();

    _initialize = null;
    _this =  null;
  }, _this.destroy);


  _initialize(params);
  params = null;
  return _this;
};


module.exports = DeaggResponse;
