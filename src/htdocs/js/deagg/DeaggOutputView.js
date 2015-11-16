'use strict';

var DeaggComponentSelectView = require('mvc/View'),
    DeaggGraphView = require('mvc/View'),
    DeaggReportView = require('mvc/View'),

    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {

};

var DeaggOutputView = function (params) {
  var _this,
      _initialize,

      _createViewSkeleton,
      _destroySubViews,
      _initSubViews,

      _componentSelectView,
      _graphView,
      _reportView;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function (/*params*/) {
    _this.el.classList.add('deagg-output-view');

    _createViewSkeleton();
    _initSubViews();
  };


  _createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<select class="deagg-component-select-view"></select>',
      '<div class="deagg-output-view-graph"></div>',
      '<div class="deagg-output-view-report"></div>'
    ].join('');
  };

  _destroySubViews = function () {
    if (_componentSelectView) {
      _componentSelectView.destroy();
      _componentSelectView = null;
    }

    if (_graphView) {
      _graphView.destroy();
      _graphView = null;
    }

    if (_reportView) {
      _reportView.destroy();
      _reportView = null;
    }
  };

  _initSubViews = function () {
    _componentSelectView = DeaggComponentSelectView({
      el: _this.el.querySelector('.deagg-component-select-view'),
      model: _this.model
    });

    _graphView = DeaggGraphView({
      el: _this.querySelector('.deagg-output-view-graph'),
      model: _this.model
    });

    _reportView = DeaggReportView({
      el: _this.querySelector('.deagg-output-view-report'),
      model: _this.model
    });
  };


  _this.destroy = Util.compose(function () {
    _destroySubViews();

    _createViewSkeleton = null;
    _destroySubViews = null;
    _initSubViews = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.onCollectionDeselect = Util.extend(function () {
    _destroySubViews();
  }, _this.onCollectionDeselect);

  _this.onCollectionSelect = Util.extend(function () {
    _initSubViews();
  }, _this.onCollectionSelect);


  _initialize(params);
  params = null;
  return _this;
};


module.exports = DeaggOutputView;
