'use strict';

var DeaggCalculator = require('deagg/DeaggCalculator'),
    DeaggGraphView = require('deagg/DeaggregationGraphView'),
    DeaggReportView = require('DeaggregationReportView'),
    DependencyFactory = require('DependencyFactory'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
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

      _btnCalculate,
      _calculator,
      _componentSelectView,
      _deaggCollection,
      _graphView,
      _reportView,

      _createViewSkeleton,
      _destroySubViews,
      _initSubViews,
      _onCalculateClick;


  params = Util.extend({}, _DEFAULTS, params);
  _this = SelectedCollectionView(params);

  _initialize = function (/*params*/) {
    _this.el.classList.add('deagg-output-view');

    _calculator = DeaggCalculator();

    _deaggCollection = Collection();

    _createViewSkeleton();
    _initSubViews();
  };


  /**
   * Populates the view container structure.
   *
   */
  _createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<div class="deagg-output-mask">',
        '<p class="alert info">',
          'Please select &ldquo;Edition&rdquo;, &ldquo;Location&rdquo; ',
          '&ldquo;Site Class&rdquo;, &ldquo;Spectral Period&rdquo; &amp; ',
          '&ldquo;Time Horizon&ldquo; above to compute a deaggregation.',
          '<br/><button class="deagg-output-calculate">',
            'Compute Deaggregation',
          '</button>',
        '</p>',
      '</div>',
      '<label>',
        'Component',
        '<select class="deagg-component-select-view"></select>',
      '</label>',
      '<div class="deagg-output-view-graph"></div>',
      '<div class="deagg-output-view-report"></div>'
    ].join('');

    _btnCalculate = _this.el.querySelector('.deagg-output-calculate');
    _btnCalculate.addEventListener('click', _onCalculateClick, _this);
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
      format: function (m) { return m.get('component'); },
      model: _this.model
    });

    _graphView = DeaggGraphView({
      collection: _deaggCollection,
      el: _this.el.querySelector('.deagg-output-view-graph')
    });

    _reportView = DeaggReportView({
      analysis: _this.model,
      collection: _deaggCollection,
      el: _this.el.querySelector('.deagg-output-view-report')
    });

    if (!_deaggCollection.getSelected()) {
      // Nothing was selected, so did not render by default, but we want
      // a graph skeleton (axes etc...) so, call render anyway
      _graphView.render();
    }
  };

  _onCalculateClick = function () {
    _this.trigger('calculate', {
      calculator: _calculator,
      serviceType: DependencyFactory.TYPE_DEAGG
    });
  };


  /**
   * Free resouces associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _destroySubViews();

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
    // _destroySubViews();
  }, _this.onCollectionDeselect);

  /**
   * Calls default implementation then initializes the sub-views with the new
   * _this.model.
   *
   */
  _this.onCollectionSelect = Util.extend(_this.onCollectionSelect, function () {
    // _initSubViews();
  });

  _this.render = function () {
    var deaggs,
        imt,
        response,
        responses;

    try {
      deaggs = [];
      imt = _this.model.get('imt');
      responses = _this.model.get('deaggResponses');

      if (responses) {
        responses.data().some(function (r) {
          if (r.get('imt').value === imt.value) {
            response = r;
            return true;
          }
        });
      }

      if (response) {
        deaggs = response.get('deaggregations').data().slice(0);
      }

      _deaggCollection.reset(deaggs);

      if (deaggs.length && !_deaggCollection.getSelected()) {
        _deaggCollection.select(deaggs[0]);
      }

    } catch (e) {
      _deaggCollection.deselect();
      _deaggCollection.reset([]);
    } finally {
      if (_deaggCollection.data().length === 0) {
        _this.el.classList.remove('deagg-output-ready');
      } else {
        _this.el.classList.add('deagg-output-ready');
      }
    }
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = DeaggOutputView;
