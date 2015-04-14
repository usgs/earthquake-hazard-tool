'use strict';


var Calculator = require('Calculator'),
    Meta = require('Meta'),
    Region = require('Region'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    ModalView = require('mvc/ModalView'),
    View = require('mvc/View'),

    Util = require('util/Util');


var SERVICE_NAME = 'staticcurve';


var StaticCurveInputView = function (params) {
  var _this,
      _initialize,

      _analysis,
      _calculator,
      _collections,
      _destroyCalculator,
      _doRender,
      _modal,
      _views,
      _viewReady,

      _createView,
      _createViewSkeleton,
      _onCalculateClick;

  _this = View();

  _initialize = function (params) {
    _collections = {};
    _views = {};

    if (params.calculator) {
      _calculator = params.calculator;
    } else {
      _calculator = Calculator();
      _destroyCalculator = true;
    }
    _calculator.getParameters(SERVICE_NAME, _createViewSkeleton);

    _modal = ModalView(_this.el, {
      buttons: [
        {
          text: 'Calculate',
          callback: _onCalculateClick,
          classes: [SERVICE_NAME + '-calculate']
        }
      ],
      closable: false,
      title: 'Hazard Curve Parameters'
    });
  };


  _createView = function (name, props) {
    var collection,
        div,
        i,
        label,
        len,
        models,
        select,
        values,
        view;

    values = props.values;
    len = values.length;
    models = [];

    for (i = 0; i < len; i++) {
      if (name === 'region') {
        models.push(Region(values[i]));
      } else {
        models.push(Meta(values[i]));
      }
    }
    collection = Collection(models);
    collection.selectById(models[0].id);
    _collections[name] = collection;


    div = document.createElement('div');
    div.classList.add(SERVICE_NAME + '-input-container');
    div.classList.add('vertical');

    label = div.appendChild(document.createElement('label'));
    label.setAttribute('for', SERVICE_NAME + '-' + name);
    label.innerHTML = props.label;

    select = div.appendChild(document.createElement('select'));
    select.setAttribute('id', SERVICE_NAME + '-' + name);
    view = CollectionSelectBox({
      el: select,
      collection: collection,
      format: function (item) {
        return item.get('display');
      }
    });
    _views[name] = view;

    return div;
  };

  _createViewSkeleton = function (params) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(_createView('edition', params.edition));
    fragment.appendChild(_createView('region', params.region));
    fragment.appendChild(_createView('imt', params.imt));
    fragment.appendChild(_createView('vs30', params.vs30));

    _this.el.appendChild(fragment);

    _viewReady = true;
    if (_doRender) {
      _doRender = false;
      _this.render();
    }
  };

  _onCalculateClick = function () {
    _analysis.set({
      edition: _collections.edition.getSelected(),
      region: _collections.region.getSelected(),

      // TODO :: Lng/Lat

      imt: _collections.imt.getSelected(),
      vs30: _collections.vs30.getSelected()
    });

    _calculator.getResult(SERVICE_NAME, _analysis);
    _this.hide();
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    var paramName;

    // Destroy objects
    for (paramName in _views) {
      _views[paramName].destroy();
    }

    for (paramName in _collections) {
      _collections[paramName].destroy();
    }

    _modal.destroy();

    if (_destroyCalculator) {
      _calculator.destroy();
    }

    // Nullify variable references
    _analysis = null;
    _calculator = null;
    _collections = null;
    _destroyCalculator = null;
    _doRender = null;
    _modal = null;
    _views = null;
    _viewReady = null;

    // Nullify function references
    _createView = null;
    _createViewSkeleton = null;
    _onCalculateClick = null;

    _this = null;
  });

  _this.hide = function () {
    _modal.hide();
  };

  _this.render = function () {
    if (!_viewReady) {
      _doRender = true;
      return;
    }

    if (_analysis) {
      _collections.edition.selectById(_analysis.get('edition').id);
      _collections.region.selectById(_analysis.get('region').id);

      // TODO :: Lng/Lat

      _collections.imt.selectById(_analysis.get('imt').id);
      _collections.vs30.selectById(_analysis.get('vs30').id);
    }
  };

  _this.show = function (analysis) {
    _analysis = analysis;
    _this.render();
    _modal.show();
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = StaticCurveInputView;
