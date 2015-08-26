'use strict';


var Collection = require('mvc/Collection'),
    d3 = require('d3'),
    D3View = require('d3/D3View'),
    ResponseSpectrumLineView = require('./ResponseSpectrumLineView'),
    Util = require('util/Util');


var ResponseSpectrumGraphView = function (options) {
  var _this,
      _initialize,
      // variables
      _curves,
      _spectrum;

  _this = D3View(Util.extend({
    clickToSelect: false,
    xLabel: 'Spectral Period',
    yLabel: 'Ground Motion (g)'
  }, options));

  _initialize = function (options) {
    _this.el.classList.add('ResponseSpectrumGraphView');

    _curves = options.curves || Collection();
    _curves.on('add', _this.render);
    _curves.on('remove',  _this.render);
    _curves.on('reset', _this.render);
    _this.curves = _curves;

    _spectrum = ResponseSpectrumLineView({
      view: _this
    });
    _this.views.add(_spectrum);
  };

  _this.render = Util.compose(function (changed) {
    var timeHorizon = _this.model.get('timeHorizon'),
        afe = 1 / timeHorizon,
        data = [],
        editCurve = [],
        yExtent;

    // rebuild data for new time horizon
    _curves.data().forEach(function (c) {
      var x = c.get('period'),
          y = c.getX(afe);

      if (x !== null && y !== null) {
        data.push([x, y]);
      }

      c.get('data').every(function (p) {
        if (p[1] >= 0.0002) {
          editCurve.push(p[0]);
          return true;
        } else {
          return false;
        }
      });
    });

    // sort by period.
    data.sort(function (a, b) {
      return a[0] - b[0];
    });

    yExtent = d3.extent(editCurve);
    _this.model.set({
      yExtent: yExtent
    }, {silent:true});

    _spectrum.model.set({
      data: data,
    }, {silent: true});

    // pass argument to original render method.
    return changed;
  }, _this.render);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = ResponseSpectrumGraphView;
