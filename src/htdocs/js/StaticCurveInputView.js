'use strict';


var Analysis = require('Analysis'),
    Calculator = require('Calculator'),
    Meta = require('Meta'),
    Region = require('Region'),

    LocationView = require('locationview/LocationView'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    ModalView = require('mvc/ModalView'),
    View = require('mvc/View'),

    Util = require('util/Util');


var SERVICE_NAME = 'staticcurve';

/**
 * This view renders itself into a ModalView dialog container. It presents
 * the user with a selection of analysis options. The user can select
 * a value for each option and then click a compute button to get the
 * static hazard curve results for the analysis.
 *
 * The default selected analysis option in the view will reflect the
 * analysis that was passed to the ```show``` method. If no analysis is
 * provided as part of the show method, then an empty analysis is created.
 *
 * The computed result is attached to the current analysis option on the
 * SERVICE_NAME property. In this way a caller can bind itself to the
 * change:SERVICE_NAME event to be notified of computations. Alternatively,
 * the caller may provide a callback during instantiation. In this case the
 * callback is invoked with arguments corresponding to
 * ```Calculator::getResult```.
 *
 * @param calculator {Calculator}
 *      The calculator to use to compute results for the analysis.
 * @param callback {Function}
 *      The function to invoke when calculations are complete.
 *
 * @see Calculator#getResult
 */
var StaticCurveInputView = function (params) {
  var _this,
      _initialize,

      _analysis,
      _calculator,
      _callback,
      _collections,
      _destroyCalculator,
      _doRender,
      _isVisible,
      _latitudeInput,
      _location,
      _locationButton,
      _longitudeInput,
      _modal,
      _views,
      _viewReady,

      _createLocationInputs,
      _createView,
      _createViewSkeleton,
      _onCalculateClick,
      _onLocation,
      _onLocationButtonClick;

  _this = View();

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    params = params || {};

    _collections = {};
    _views = {};

    if (params.calculator) {
      _calculator = params.calculator;
    } else {
      _calculator = Calculator();
      _destroyCalculator = true;
    }
    _calculator.getParameters(SERVICE_NAME, _createViewSkeleton);

    _callback = params.callback || null;

    _modal = ModalView(_this.el, {
      buttons: [
        {
          text: 'Calculate',
          callback: _onCalculateClick,
          classes: [SERVICE_NAME + '-calculate', 'green']
        },
        {
          text: 'Cancel',
          callback: _this.hide,
          classes: [SERVICE_NAME + '-cancel']
        }
      ],
      classes: [SERVICE_NAME + '-modal'],
      closable: false,
      title: 'Hazard Curve Parameters'
    });
    _isVisible = false;

    _location = LocationView({
      callback: _onLocation
    });
  };


  /**
   * @PrivateMethod
   *
   * Creates a latitude and longitude input as well as a control to open
   * a LocationView to input a latitude/longitude using a map.
   *
   * @param lngParams {Object}
   *      An object containing a label key to be used for the longitude label.
   * @param latParams {Object}
   *      An object containing a label key to be used for the latitude label.
   *
   * @see LocationView
   */
  _createLocationInputs = function (lngParams, latParams) {
    var div;

    div = document.createElement('div');
    div.classList.add(SERVICE_NAME + '-location');
    div.classList.add('vertical');

    div.innerHTML = [
      '<label for="', SERVICE_NAME, '-latitude">',
        latParams.label,
      '</label>',
      '<input type="text" id="', SERVICE_NAME, '-latitude" class="latitude"/>',
      '<label for="', SERVICE_NAME, '-longitude">',
        lngParams.label,
      '</label>',
      '<input type="text" id="', SERVICE_NAME, '-longitude" ',
          'class="longitude"/>',
      '<a href="javascript:void(null);" ',
          'class="location-button ', SERVICE_NAME, '-location-widget">',
        'Use a map to select location',
      '</a>'
    ].join('');

    _latitudeInput = div.querySelector('.latitude');
    _longitudeInput = div.querySelector('.longitude');
    _locationButton = div.querySelector('.location-button');

    _locationButton.addEventListener('click', _onLocationButtonClick);

    return div;
  };

  /**
   * @PrivateMethod
   *
   * Creates a DOM container with a label and SelectBoxView for the given
   * named analysis option. This method is called during _createViewSkeleton.
   *
   * @param name {String}
   *      The name of the view currently being created.
   * @param props {Object}
   *      A set of properties associated with the view being created. In
   *      particular, this needs a ```values``` and ```label``` property. The
   *      values property is an array of objects representing Meta/Region
   *      models. The label property is a string used to label this view.
   *
   * @see SelectBoxView
   */
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

  /**
   * @PrivateMethod
   *
   * This method is provided as the callback to
   * ```Calculator::getParameters```.
   *
   * @param params {Object}
   *      An object containing parameters enumerations as provided by the
   *      ```Calculator::getParameters``` method.
   */
  _createViewSkeleton = function (params) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(_createView('edition', params.edition));
    fragment.appendChild(_createView('region', params.region));

    fragment.appendChild(_createView('imt', params.imt));
    fragment.appendChild(_createView('vs30', params.vs30));

    fragment.appendChild(_createLocationInputs(
        params.longitude, params.latitude));

    _this.el.appendChild(fragment);


    _viewReady = true;
    if (_doRender) {
      _doRender = false;
      _this.render();
    }
  };

  /**
   * @EventListener
   *
   * This method is called when the calculate button on this view is clicked.
   * It updates the current analysis model and then delegates to the
   * calculator to compute results.
   *
   */
  _onCalculateClick = function () {
    _analysis.set({
      edition: _collections.edition.getSelected(),
      region: _collections.region.getSelected(),

      longitude: parseFloat(_longitudeInput.value),
      latitude: parseFloat(_latitudeInput.value),

      imt: _collections.imt.getSelected(),
      vs30: _collections.vs30.getSelected()
    });

    _calculator.getResult(SERVICE_NAME, _analysis, _callback);

    _this.hide();
  };

  /**
   * @EventListener
   *
   * This method is called when a location is specified using the LocationView.
   * It accepts the selected location and updates the input boxes in this
   * view to reflect the selected location coordinates.
   *
   * @param local {Object}
   *      An object containing latitude, longitude, and potentially confidence
   *      values.
   */
  _onLocation = function (loc) {
    var latitude,
        longitude;

    latitude = loc.latitude;
    longitude = loc.longitude;

    if (loc.confidence >= 0) {
      latitude = latitude.toFixed(loc.confidence);
      longitude = longitude.toFixed(loc.confidence);
    }

    _latitudeInput.value = latitude;
    _longitudeInput.value = longitude;
  };

  /**
   * @EventListener
   *
   * This method is called when the button to select a location on a map is
   * clicked. It shows the location view and defaults the location to what
   * is currently input into the latitude/longitude input boxes in this view.
   *
   */
  _onLocationButtonClick = function () {
    var latitude,
        longitude,
        options;

    latitude = _latitudeInput.value;
    longitude = _longitudeInput.value;
    options = {};

    if (latitude !== '' && longitude !== '') {
      options.location = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    }

    _location.show(options);
  };


  /**
   * @APIMethod
   *
   * This method should be called when cleaning up this view. It unbinds
   * any event handlers, destroys its elements and nullifies variables.
   *
   */
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

    _locationButton.removeEventListener('click', _onLocationButtonClick);

    // Nullify variable references
    _analysis = null;
    _calculator = null;
    _callback = null;
    _collections = null;
    _destroyCalculator = null;
    _doRender = null;
    _latitudeInput = null;
    _location = null;
    _locationButton = null;
    _longitudeInput = null;
    _modal = null;
    _views = null;
    _viewReady = null;

    // Nullify function references
    _createLocationInputs = null;
    _createView = null;
    _createViewSkeleton = null;
    _onCalculateClick = null;
    _onLocation = null;
    _onLocationButtonClick = null;

    _this = null;
  });

  /**
   * @APIMethod
   *
   * Hides this view by closing the underlying ModalView.
   *
   */
  _this.hide = function () {
    _analysis = null;
    _modal.hide();
    _isVisible = false;
  };

  /**
   * @APIMethod
   *
   * Updates the view input/select boxes with the current analysis values. If
   * the view has not completed creating its skeleton yet, rendering is
   * deferred until the skeleton is ready.
   *
   */
  _this.render = function () {
    var edition,
        imt,
        latitude,
        longitude,
        region,
        vs30;

    if (!_viewReady) {
      _doRender = true;
      return;
    }

    if (_analysis) {
      edition = _analysis.get('edition');
      if (edition) {
        _collections.edition.selectById(edition.id);
      }

      region = _analysis.get('region');
      if (region) {
        _collections.region.selectById(region.id);
      }

      longitude = _analysis.get('longitude');
      if (longitude !== null) {
        _longitudeInput.value = longitude;
      }

      latitude = _analysis.get('latitude');
      if (latitude !== null) {
        _latitudeInput.value = latitude;
      }

      imt = _analysis.get('imt');
      if (imt) {
        _collections.imt.selectById(imt.id);
      }

      vs30 = _analysis.get('vs30');
      if (vs30) {
        _collections.vs30.selectById(vs30.id);
      }
    }
  };

  /**
   * @APIMethod
   *
   * Shows the view with options defaulted to the values indicated by the
   * given analysis. If no analysis is given, an new analysis is created.
   *
   */
  _this.show = function (analysis) {
    _analysis = analysis || Analysis();

    _this.render();

    if (!_isVisible) {
      _modal.show();
      _isVisible = true;
    }
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = StaticCurveInputView;
