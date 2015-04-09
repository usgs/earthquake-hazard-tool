'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');


var DEFAULTS = {
  curve: null
};


/**
 * Display a HazardCurve as a Graph
 *
 * @param options {Object}
 *        all options are passed to View.
 * @see mvc/View
 */
var HazardCurveGraphView = function (options) {
  var _this,
      _initialize,
      // variables
      _curve;

  _this = View(options);

  _initialize = function (options) {
    var el;
    // set defaults
    options = Util.extend({}, DEFAULTS, options);
    // parse options
    _curve = options.curve;
    // create skeleton
    el = _this.el;
    el.innerHTML = '<p>I am a HazardCurveGraphView</p>';
  };

  /**
   * Unbind event listeners and free references.
   */
  _this.destroy = Util.compose(function () {
    _curve = null;
  }, _this.destroy);

  /**
   * Draw/update the graph.
   */
  _this.render = function () {
    // TODO
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = HazardCurveGraphView;
