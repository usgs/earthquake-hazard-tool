'use strict';

var Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    DeaggCalculator = require('deagg/DeaggCalculator'),
    DeaggGraphView = require('deagg/DeaggregationGraphView'),
    DeaggReportView = require('DeaggregationReportView'),
    DependencyFactory = require('DependencyFactory'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');


var _DEFAULTS;

_DEFAULTS = {

};


/**
 * This view serves as a wrapper around the various output component views
 * for a deaggregation calculation.
 *
 */
var DeaggOutputView = function (params) {
  var _this,
      _initialize;


  params = Util.extend({}, _DEFAULTS, params);
  _this = SelectedCollectionView(params);

  _initialize = function (params) {
    _this.el.classList.add('deagg-output-view');

    _this.calculator = DeaggCalculator();

    _this.deaggCollection = Collection();
    _this.dependencyFactory = params.dependencyFactory;

    _this.createViewSkeleton();
    _this.initSubViews();
  };


  /**
   * Displays info message for supported and unsupported deagg calculations
   *
   */
  _this.createAlertEl = function () {
    var el,
        isSupported;

    el = _this.el.querySelector('.deagg-output-mask');


    if (!_this.model) {
      return;
    }

    // check if edition supports a deagg calculation
    isSupported = _this.dependencyFactory.isSupportedEdition(
        _this.model.get('edition'));

    if (isSupported) {
      // expand the accordion section
      _this.el.parentElement.parentElement.classList.remove('accordion-closed');
      // add info
      el.innerHTML = ['<p class="alert info">',
          'Please select &ldquo;Edition&rdquo;, &ldquo;Location&rdquo; ',
          '&ldquo;Site Class&rdquo;, &ldquo;Spectral Period&rdquo; &amp; ',
          '&ldquo;Time Horizon&ldquo; above to compute a deaggregation.',
          '<br/><button class="deagg-output-calculate">',
            'Compute Deaggregation',
          '</button>',
        '</p>'
      ].join('');
      // add calculate button
      _this.btnCalculate = _this.el.querySelector('.deagg-output-calculate');
      _this.btnCalculate.addEventListener('click', _this.onCalculateClick);
    } else {
      // Collapse the accordion section
      _this.el.parentElement.parentElement.classList.add('accordion-closed');
      // Add warning, without calculate button
      el.innerHTML = ['<p class="alert warning">',
          'Deaggregation calculations are not available for the selected ',
          'edition.',
        '</p>'].join('');
      // if button exists, remove event listener
      if (_this.btnCalculate) {
        _this.btnCalculate.removeEventListener('click', _this.onCalculateClick);
      }
    }
  };

  /**
   * Populates the view container structure.
   *
   */
  _this.createViewSkeleton = function () {
    _this.el.innerHTML = [
      '<div class="deagg-output-mask"></div>',
      '<label>',
        'Component',
        '<select class="deagg-component-select-view"></select>',
      '</label>',
      '<div class="deagg-output-view-graph"></div>',
      '<div class="deagg-output-view-report"></div>'
    ].join('');
  };

  /**
   * Free resouces associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _this.destroySubViews();

    _this.deaggCollection.destroy();
    _this.deaggCollection = null;

    _this.createAlertEl = null;
    _this.createViewSkeleton = null;
    _this.destroySubViews = null;
    _this.dependencyFactory = null;
    _this.invalidateDeaggregation = null;
    _this.initSubViews = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Clean up each managed sub-view.
   *
   */
  _this.destroySubViews = function () {
    if (_this.componentSelectView) {
      _this.componentSelectView.destroy();
      _this.componentSelectView = null;
    }

    if (_this.graphView) {
      _this.graphView.destroy();
      _this.graphView = null;
    }

    if (_this.reportView) {
      _this.reportView.destroy();
      _this.reportView = null;
    }
  };

  /**
   * Initialize each managed sub-view.
   *
   */
  _this.initSubViews = function () {
    _this.componentSelectView = CollectionSelectBox({
      collection: _this.deaggCollection,
      el: _this.el.querySelector('.deagg-component-select-view'),
      format: function (m) { return m.get('component'); },
      model: _this.model
    });

    _this.graphView = DeaggGraphView({
      collection: _this.deaggCollection,
      el: _this.el.querySelector('.deagg-output-view-graph')
    });

    _this.reportView = DeaggReportView({
      analysis: _this.model,
      collection: _this.deaggCollection,
      el: _this.el.querySelector('.deagg-output-view-report')
    });

    if (!_this.deaggCollection.getSelected()) {
      // Nothing was selected, so did not render by default, but we want
      // a graph skeleton (axes etc...) so, call render anyway
      _this.graphView.render();
    }
  };

  _this.invalidateDeaggregation = function () {
    _this.model.set({
      deaggResponses: null
    });
  };

  _this.onCalculateClick = function () {
    _this.trigger('calculate', {
      calculator: _this.calculator,
      serviceType: DependencyFactory.TYPE_DEAGG
    });
  };

  /**
   * unset the event bindings for the model
   */
  _this.onCollectionDeselect = function () {
    _this.deaggCollection.reset([]);
    _this.model.off('change', 'render', _this);
    _this.model.off('change:edition', 'invalidateDeaggregation', _this);
    _this.model.off('change:location', 'invalidateDeaggregation', _this);
    _this.model.off('change:vs30', 'invalidateDeaggregation', _this);
    _this.model.off('change:imt', 'invalidateDeaggregation', _this);
    _this.model.off('change:timeHorizon', 'invalidateDeaggregation', _this);
    _this.model = null;
    _this.render({model: _this.model});
  };

  /**
   * set event bindings for the model
   */
  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();
    _this.model.on('change:edition', 'invalidateDeaggregation', _this);
    _this.model.on('change:location', 'invalidateDeaggregation', _this);
    _this.model.on('change:vs30', 'invalidateDeaggregation', _this);
    _this.model.on('change:imt', 'invalidateDeaggregation', _this);
    _this.model.on('change:timeHorizon', 'invalidateDeaggregation', _this);
    _this.model.on('change', 'render', _this);
    _this.render({model: _this.model});
  };

  _this.render = function () {
    var deaggs,
        imt,
        response,
        responses;

    // Update deaggregation alert info/warning
    _this.createAlertEl();

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

      _this.deaggCollection.reset(deaggs);

      if (deaggs.length && !_this.deaggCollection.getSelected()) {
        // set graph plot area based on "Total" deaggregation, which is first
        _this.graphView.bounds = DeaggGraphView.calculateBounds(
            deaggs[0].get('data'));
        _this.deaggCollection.select(deaggs[0]);
      }

    } catch (e) {
      _this.deaggCollection.deselect();
      _this.deaggCollection.reset([]);
    } finally {
      if (_this.deaggCollection.data().length === 0) {
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
