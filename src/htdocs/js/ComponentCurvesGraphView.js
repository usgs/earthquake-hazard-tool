'use strict';


var Collection = require('mvc/Collection'),
    HazardCurveGraphView = require('./HazardCurveGraphView'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    Util = require('util/Util');


var _EMPTY_CLASS,
    _VIEW_CLASS;

// view class name
_VIEW_CLASS = 'ComponentCurvesGraphView';

// class name added when there aren't curves to plot.
_EMPTY_CLASS = 'ComponentCurvesGraphView-empty';


/**
 * ComponentCurvesGraphView extends SelectedCollectionView to display
 * component curves for the currently selected HazardCurve.
 *
 * It takes component curves from the currently selected HazardCurve and
 * displays them using a HazardCurveGraphView.
 */
var ComponentCurvesGraphView = function (options) {
  var _this,
      _initialize;


  _this = SelectedCollectionView(options);

  /**
   * Initialize the ComponentCurvesGraphView.
   */
  _initialize = function (/*options*/) {
    _this.el.classList.add(_VIEW_CLASS);
    _this.el.classList.add(_EMPTY_CLASS);
    _this.el.innerHTML = '<div></div>';

    _this.curves = Collection();
    _this.curveView = HazardCurveGraphView({
      el: _this.el.querySelector('div'),
      curves: _this.curves
    });
  };

  /**
   * Destroy collection and wrapped view.
   */
  _this.destroy = Util.compose(function () {
    _this.curveView.destroy();
    _this.curves.destroy();
  }, _this.destroy);

  /**
   * Update the title and curves collection with either component curves from
   * currently selected HazardCurve, or empty array if no components exist.
   */
  _this.render = function () {
    var components,
        label;

    label = 'Component Curves for ';
    if (_this.model) {
      components = _this.model.get('components');
      label += _this.model.get('label');
      if (components !== null) {
        components = components.data();
      }
    }
    components = components || [];

    // manage state class
    if (components.length === 0) {
      _this.el.classList.add(_EMPTY_CLASS);
    } else {
      _this.el.classList.remove(_EMPTY_CLASS);
    }

    // update collection
    _this.curveView.model.set({
      title: label
    }, {silent: true});
    _this.curves.reset(components);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = ComponentCurvesGraphView;
