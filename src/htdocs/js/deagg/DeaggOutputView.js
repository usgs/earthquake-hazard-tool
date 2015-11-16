'use strict';

var DeaggGraphView = require('mvc/View'),
    DeaggReportView = require('mvc/View'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/SelectView'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');


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
      _deaggCollection,
      _graphView,
      _reportView;


  params = Util.extend({}, _DEFAULTS, params);
  _this = SelectedCollectionView(params);

  _initialize = function (/*params*/) {
    _this.el.classList.add('deagg-output-view');

    _deaggCollection = Collection();
    _deaggCollection.on('select', 'onComponentSelect', _this);

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
    _componentSelectView = CollectionSelectBox({
      collection: _deaggCollection,
      el: _this.el.querySelector('.deagg-component-select-view'),
      model: _this.model
    });

    _graphView = DeaggGraphView({
      collection: _deaggCollection,
      el: _this.el.querySelector('.deagg-output-view-graph'),
      model: _this.model
    });

    _reportView = DeaggReportView({
      collection: _this.collection,
      el: _this.el.querySelector('.deagg-output-view-report'),
      model: _this.model
    });
  };

  /**
   * Free resouces associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _destroySubViews();

    _deaggCollection.off('select', 'onComponentSelect', _this);
    _deaggCollection.destroy();
    _deaggCollection = null;

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
    _deaggCollection.reset([]);
    _destroySubViews();
  }, _this.onCollectionDeselect);

  /**
   * Calls default implementation then initializes the sub-views with the new
   * _this.model.
   *
   */
  _this.onCollectionSelect = Util.extend(_this.onCollectionSelect, function () {
    var imt,
        response,
        responses;

    imt = _this.model.get('imt');
    responses = _this.model.get('deaggResponses');

    if (responses) {
      responses.data.some(function (r) {
        if (r.get('imt').value === imt.value) {
          response = r;
          return true;
        }
      });
    }

    _deaggCollection.reset(response ? response.get('data') : []);
  });


  _initialize(params);
  params = null;
  return _this;
};


module.exports = DeaggOutputView;
