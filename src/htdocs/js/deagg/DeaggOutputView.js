'use strict';

var DeaggComponentSelectView = require('mvc/View'),
    DeaggGraphView = require('mvc/View'),
    DeaggReportView = require('mvc/View'),

    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {

};

/**
 * This view serves as a wrapper around the various output component views
 * for a deaggregation calculation.
 *
 */
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


  /**
   * Populates the view container structure.
   *
   */
  _createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<select class="deagg-component-select-view"></select>',
      '<div class="deagg-output-view-graph"></div>',
      '<div class="deagg-output-view-report"></div>'
    ].join('');
  };

  /**
   * Clean up each managed sub-view.
   *
   */
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

  /**
   * Initialize each managed sub-view.
   *
   */
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

  /**
   * Free resouces associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _destroySubViews();

    _createViewSkeleton = null;
    _destroySubViews = null;
    _initSubViews = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Destroys sub-views and then calls default implementation to unbind
   * from _this.model.
   *
   */
  _this.onCollectionDeselect = Util.extend(function () {
    _destroySubViews();
  }, _this.onCollectionDeselect);

  /**
   * Calls default implementation then initializes the sub-views with the new
   * _this.model.
   *
   */
  _this.onCollectionSelect = Util.extend(_this.onCollectionSelect, function () {
    _initSubViews();
  });


  _initialize(params);
  params = null;
  return _this;
};


module.exports = DeaggOutputView;
