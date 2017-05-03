'use strict';


var ComponentCurvesGraphView = require('ComponentCurvesGraphView'),
    CurveCalculator = require('CurveCalculator'),
    DependencyFactory = require('DependencyFactory'),
    HazardCurveGraphView = require('HazardCurveGraphView'),
    ResponseSpectrumGraphView = require('ResponseSpectrumGraphView'),

    Collection = require('mvc/Collection'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');


// Default values to be used by constructor
var _DEFAULTS = {
   // ... some defaults ...
};


/**
 * Class: CurveOutputView
 *
 * @param params {Object}
 *      Configuration options. See _DEFAULTS for more details.
 */
var CurveOutputView = function (params) {
  var _this,
      _initialize;


  // Inherit from parent class
  params = Util.extend({}, _DEFAULTS, params);
  _this = SelectedCollectionView(params);

  /**
   * @constructor
   *
   */
  _initialize = function (/*params*/) {
    _this.calculator = CurveCalculator();

    _this.curves = Collection([]);
    _this.curves.on('select', 'onCurvesSelect', _this);
    _this.curves.on('deselect', 'onCurvesDeselect', _this);

    _this.createViewSkeleton();
    _this.initSubViews();
  };


  _this.createViewSkeleton = function () {
    _this.el.classList.add('curve-output-view');
    _this.el.classList.add('row');

    _this.el.innerHTML = [
      '<div class="curve-output-mask">',
        '<p class="alert info">',
          'Please select &ldquo;Edition&rdquo;, &ldquo;Location&rdquo; ',
          '&amp; &ldquo;Site Class&rdquo; above to compute a hazard curve.',
          '<br/><button class="curve-output-calculate">',
            'Compute Hazard Curve',
          '</button>',
        '</p>',
      '</div>',
      '<div class="curve-output-view-mean column one-of-two"></div>',
      '<div class="curve-output-view-spectrum column one-of-two"></div>',
      '<div class="curve-output-view-component column one-of-two"></div>'
    ].join('');

    _this.btnCalculate = _this.el.querySelector('.curve-output-calculate');
    _this.btnCalculate.addEventListener('click', _this.onCalculateClick);
  };

  _this.destroy = Util.compose(function () {
    _this.btnCalculate.removeEventListener('click', _this.onCalculateClick);

    _this.curves.off('select', 'onCurvesSelect', _this);
    _this.curves.off('deselect', 'onCurvesDeselect', _this);

    _this.componentView.destroy();
    _this.curves.destroy();
    _this.meanCurveView.destroy();
    _this.spectrumView.destroy();

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.initSubViews = function () {
    _this.meanCurveView = HazardCurveGraphView({
      curves: _this.curves,
      el: _this.el.querySelector('.curve-output-view-mean')
          .appendChild(document.createElement('div')),
      title: 'Hazard Curves'
    });

    _this.spectrumView = ResponseSpectrumGraphView({
      curves: _this.curves,
      el: _this.el.querySelector('.curve-output-view-spectrum')
          .appendChild(document.createElement('div')),
      title: 'Uniform Hazard Response Spectrum'
    });

    _this.componentView = ComponentCurvesGraphView({
      collection: _this.curves,
      el: _this.el.querySelector('.curve-output-view-component')
          .appendChild(document.createElement('div')),
      title: 'Hazard Curve Components'
    });
  };

  _this.invalidateCurves = function () {
    _this.model.set({
      curves: null
    });
  };

  _this.onCalculateClick = function () {
    _this.trigger('calculate', {
      calculator: _this.calculator,
      serviceType: DependencyFactory.TYPE_CURVE
    });
  };

  /**
   * unset the event bindings for the model
   */
  _this.onCollectionDeselect = function () {
    _this.model.off('change', 'render', _this);
    _this.model.off('change:edition', 'invalidateCurves', _this);
    _this.model.off('change:location', 'invalidateCurves', _this);
    _this.model.off('change:vs30', 'invalidateCurves', _this);
    _this.model = null;
    _this.render({model: _this.model});
  };

  /**
   * set event bindings for the model
   */
  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();
    _this.model.on('change:edition', 'invalidateCurves', _this);
    _this.model.on('change:location', 'invalidateCurves', _this);
    _this.model.on('change:vs30', 'invalidateCurves', _this);
    _this.model.on('change', 'render', _this);
    _this.render({model: _this.model});
  };

  _this.onCurvesDeselect = function () {
    if (_this.model) {
      _this.model.set({
        imt: null
      });
    }
  };

  _this.onCurvesSelect = function () {
    var curve;

    curve = _this.curves.getSelected();

    if (_this.model) {
      _this.model.set({
        imt: curve.get('imt')
      });
    }
  };

  _this.render = function (changes) {
    var curves,
        data,
        id,
        imt,
        timeHorizon,
        xAxisLabel,
        yAxisLabel;

    data = [];
    timeHorizon = 2475;
    id = null;
    xAxisLabel = 'Ground Motion (g)';
    yAxisLabel = 'Annual Frequency of Exceedance';

    if (_this.model && changes) {
      curves = _this.model.get('curves');

      if (curves) {
        xAxisLabel = curves.get('xlabel');
        yAxisLabel = curves.get('ylabel');

        try {
          data = curves.get('curves').data();
        } catch (e) {
          // No data...ignore
        }
      }

      timeHorizon = _this.model.get('timeHorizon');
      imt = _this.model.get('imt');
      data.some(function (curve) {
        if (curve.get('imt') === imt) {
          id = curve.get('id');
          return true;
        }
      });
    }

    // Update curve plotting
    try {
      _this.meanCurveView.model.set({
        'xLabel': xAxisLabel,
        'yLabel': yAxisLabel,
        'timeHorizon': timeHorizon
      }, {silent: true});
    } catch (e) {
      if (console && console.error) {
        console.error(e);
      }
    }

    // Update spectra plotting
    try {
      _this.spectrumView.model.set({
        'timeHorizon': timeHorizon
      }, {silent: true});
    } catch (e) {
      if (console && console.error) {
        console.error(e);
      }
    }

    _this.curves.reset(data);

    if (data.length === 0) {
      _this.el.classList.remove('curve-output-ready');
    } else {
      _this.el.classList.add('curve-output-ready');
    }

    if (id !== null) {
      _this.curves.selectById(id);
    }
  };


  // Always call the constructor
  _initialize(params);
  params = null;
  return _this;
};


module.exports = CurveOutputView;
