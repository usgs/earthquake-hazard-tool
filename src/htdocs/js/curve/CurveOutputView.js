'use strict';

var ComponentCurvesGraphView = require('ComponentCurvesGraphView'),
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
      _initialize,

      _createViewSkeleton,
      _initSubViews,
      _onCalculateClick,

      _btnCalculate,
      _componentView,
      _curves,
      _meanCurveView,
      _spectrumView;


  // Inherit from parent class
  params = Util.extend({}, _DEFAULTS, params);
  _this = SelectedCollectionView(params);

  /**
   * @constructor
   *
   */
  _initialize = function (/*params*/) {
    _curves = Collection([]);
    _curves.on('select', 'onCurvesSelect', _this);
    _curves.on('deselect', 'onCurvesDeselect', _this);

    _createViewSkeleton();
    _initSubViews();
  };


  _createViewSkeleton = function () {
    _this.el.classList.add('curve-output-view');

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

    _btnCalculate = _this.el.querySelector('.curve-output-calculate');
    _btnCalculate.addEventListener('click', _onCalculateClick, _this);
  };

  _initSubViews = function () {
    _meanCurveView = HazardCurveGraphView({
      curves: _curves,
      el: _this.el.querySelector('.curve-output-view-mean')
          .appendChild(document.createElement('div')),
      title: 'Hazard Curves'
    });

    _spectrumView = ResponseSpectrumGraphView({
      curves: _curves,
      el: _this.el.querySelector('.curve-output-view-spectrum')
          .appendChild(document.createElement('div')),
      title: 'Response Spectrum'
    });

    _componentView = ComponentCurvesGraphView({
      collection: _curves,
      el: _this.el.querySelector('.curve-output-view-component')
          .appendChild(document.createElement('div')),
      title: 'Hazard Curve Components'
    });
  };

  _onCalculateClick = function () {
    console.log('TODO :: Tell application to fetch curve data ...');
  };


  _this.destroy = Util.compose(function () {
    _btnCalculate.removeEventListener('click', _onCalculateClick, _this);
    _curves.off();

    _componentView.destroy();
    _curves.destroy();
    _meanCurveView.destroy();
    _spectrumView.destroy();

    _btnCalculate = null;
    _componentView = null;
    _curves = null;
    _meanCurveView = null;
    _spectrumView = null;

    _createViewSkeleton = null;
    _initSubViews = null;
    _onCalculateClick = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.onCurvesDeselect = function () {
    if (_this.model) {
      _this.model.set({
        imt: null
      });
    }
  };

  _this.onCurvesSelect = function () {
    var curve;

    curve = _curves.getSelected();

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
        data = curves.get('curves').data();
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
      _meanCurveView.model.set({
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
      _spectrumView.model.set({
        'timeHorizon': timeHorizon
      }, {silent: true});
    } catch (e) {
      if (console && console.error) {
        console.error(e);
      }
    }

    _curves.reset(data);

    if (data.length === 0) {
      _this.el.classList.remove('curve-output-ready');
    } else {
      _this.el.classList.add('curve-output-ready');
    }

    if (id !== null) {
      _curves.selectById(id);
    }
  };


  // Always call the constructor
  _initialize(params);
  params = null;
  return _this;
};


module.exports = CurveOutputView;
