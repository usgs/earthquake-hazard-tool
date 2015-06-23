'use strict';

var Meta = require('Meta'),
    DependencyFactory = require('DependencyFactory'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');

var TIME_HORIZONS = [
  {
    'id': 2475,
    'value': 2475,
    'display': '2% in 50 years',
    'displayorder': 0
  },
  {
    'id': 475,
    'value': 475,
    'display': '10% in 50 years',
    'displayorder': 1
  }
];

/**
 * Displays a collection of Time Horizons in a collection select box,
 * The collection of time horizons updates when the selected analysis
 * in the collection of analyses changes.
 *
 * TimeHorizonSelectView({
 *   el: document.createElement('div'),
 *   editions: Collection([TimeHorizon]),
 *   collection: Collection([Analysis])
 * });
 *
 * @param {[type]} params [description]
 */
var TimeHorizonSelectView = function (params) {

  var _this,
      _initialize,

      _dependencyFactory,
      _destroyDependencyFactory,
      _selectTimeHorizon,
      _timeHorizonCollection,
      _timeHorizonCollectionSelectBox,

      _updateTimeHorizon,
      _updateTimeHorizonCollectionSelectBox;

  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function (params) {

    // time horizon Collection
    _timeHorizonCollection = Collection(TIME_HORIZONS.map(Meta));

    // time horizon CollectionSelectBox
    _timeHorizonCollectionSelectBox = CollectionSelectBox({
      collection: _timeHorizonCollection,
      el: _this.el,
      includeBlankOption: true,
      format: function (model) {
        return model.get('display');
      }
    });

    // bind to select on the Site Class collection
    _timeHorizonCollection.on('select', _updateTimeHorizon);
    _timeHorizonCollection.on('deselect', _updateTimeHorizon);

    // get an instance of the dependency factory
    if (params.factory) {
      _dependencyFactory = params.factory;
      _destroyDependencyFactory = false;
    } else {
      _dependencyFactory = DependencyFactory.getInstance();
      _destroyDependencyFactory = true;
    }

    // update/select the time horizon in the currently selected Analysis
    _dependencyFactory.whenReady(function () {
      _updateTimeHorizonCollectionSelectBox();
      _this.render();
    });
  };

  /**
   * update the currently selected Analysis model with
   * the currently selected Site Class in the CollectionSelectBox.
   */
  _updateTimeHorizon = function () {
    var timeHorizon;

    if (_this.model) {

      // get the value off of the selected item in _timeHorizonCollection
      if (_timeHorizonCollection.getSelected()) {
        timeHorizon = _timeHorizonCollection.getSelected().get('value');
      } else {
        timeHorizon = null;
      }

      _this.model.set({'timeHorizon': timeHorizon});
    }
  };

  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {
    // destroy
    if (_destroyDependencyFactory) {
      _dependencyFactory.destroy();
    }
    _timeHorizonCollection.destroy();
    _timeHorizonCollectionSelectBox.destroy();
    // unbind
    _timeHorizonCollection.off('select', _updateTimeHorizon);
    _timeHorizonCollection.off('deselect', _updateTimeHorizon);
    // methods
    _updateTimeHorizon = null;
    // variables
    _dependencyFactory = null;
    _destroyDependencyFactory = null;
    _selectTimeHorizon = null;
    _timeHorizonCollection = null;
    _timeHorizonCollectionSelectBox = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);


  /**
   * render the selected time horizon, or the blank option
   */
  _this.render = function () {
    var timeHorizon;

    // Update selected time horizon when collection changes
    if (_this.model) {
      timeHorizon = _this.model.get('timeHorizon');
      if (timeHorizon === null) {
        _timeHorizonCollection.deselect();
      } else {
        _timeHorizonCollection.selectById(timeHorizon.id);
      }
    } else {
      // no item in the collection has been selected
      _timeHorizonCollection.deselect();
    }
  };

  _initialize(params);
  params = null;
  return _this;

};

module.exports = TimeHorizonSelectView;