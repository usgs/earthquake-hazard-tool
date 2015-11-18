'use strict';

var D33dCuboid = require('d3/D33dCuboid'),
    D33dGroup = require('d3/D33dGroup'),
    Util = require('util/Util');


var _DEFAULTS = {
  size: 1,
  xScale: 1,
  yScale: 1,
  zScale: 1
};


/**
 * Represents one vertical bar on a deaggregation plot.
 *
 * @param options {Object}
 * @param options.bin {Object}
 *        one magnitude/distance bin object.
 * @param options.bin.m {Number}
 *        magnitude.
 * @param options.bin.r {Number}
 *        distance.
 * @param options.bin.εdata {Array<Object>}
 *        epsilon bin percent contributions.
 * @param options.size {Number}
 *        default 1.
 *        size of bin around distance/magnitude point on graph.
 * @param options.xScale {Number}
 *        default 1.
 *        multiplier for raw x values.
 * @param options.yScale {Number}
 *        default 1.
 *        multiplier for raw y values.
 * @param options.zScale {Number}
 *        default 1.
 *        multiplier for raw z values.
 */
var D33dDeaggregationBin = function (options) {
  var _this,
      _initialize,
      // methods
      _createEpsilonCuboids;


  _this = D33dGroup({
    className: 'D33dDeaggregationBin'
  });

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _createEpsilonCuboids(options);
  };

  /**
   * Create all epsilon bins within this magnitude/distance bin.
   */
  _createEpsilonCuboids = function (options) {
    var bin,
        items,
        m,
        r,
        size,
        total,
        x,
        xScale,
        y,
        yScale,
        z,
        zScale,
        εbinIds,
        εbins,
        εdata;

    bin = options.bin;
    εbins = options.εbins;
    size = options.size / 2;
    xScale = options.xScale;
    yScale = options.yScale;
    zScale = options.zScale;
    m = bin.m;
    r = bin.r;
    εdata = bin.εdata;
    εbinIds = εbins.getIds();

    items = [];
    // represents total contribution after all bins are processed.
    total = 0;
    εdata.forEach(function (bin) {
      var item,
          value,
          εbin;

      value = bin.value;
      εbin = bin.εbin;

      x = r * xScale;
      y = m * yScale;
      z = total * zScale;

      // cuboid for this epsilon bin contribution
      item = D33dCuboid({
        x0: x - size,
        x1: x + size,
        y0: y - size,
        y1: y + size,
        z0: z,
        z1: z + value * zScale
      });
      item.el.setAttribute('data-bin-index', εbinIds[εbin]);
      items.push(item);

      // increase with each epsilon bin contribution
      total += value;
    });

    _this.model.set({
      items: items
    }, {silent: true});
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = D33dDeaggregationBin;
