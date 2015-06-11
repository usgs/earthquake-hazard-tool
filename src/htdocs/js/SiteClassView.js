'use strict';

var Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),

    Util = require('util/Util');

/**
 * Displays a collection of site classes in a collection select box,
 * The collection of site classes updates when the selected analysis
 * in the collection of analyses changes.
 *
 * SiteClassView({
 *   el: document.createElement('div'),
 *   editions: Collection([SiteClass]),
 *   collection: Collection([Analysis])
 * });
 *
 * @param {[type]} params [description]
 */
var SiteClassView = function (params) {

  var _this,
      _initialize,

      _selectSiteClass,
      _siteClassCollection,
      _siteClassCollectionSelectBox,

      _updateSiteClass,
      _updateSiteClassCollectionSelectBox;

  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function (params) {

    // editions CollectionSelectBox
    _siteClassCollection = params.vs30 || Collection();

    _siteClassCollectionSelectBox = CollectionSelectBox({
      collection: _siteClassCollection,
      el: _this.el,
      includeBlankOption: true,
      format: function (model) {
        return model.get('display');
      }
    });

    // bind to select on the Site Class collection
    _siteClassCollection.on('select', _updateSiteClass);
    _siteClassCollection.on('deselect', _updateSiteClass);

    // select the edition in the currently selected Analysis
    _this.render();
  };

  /**
   * update the currently selected Analysis model with
   * the currently selected Site Class  in the CollectionSelectBox.
   */
  _updateSiteClass = function () {
    if (_this.model) {
      _this.model.set({'vs30': _siteClassCollection.getSelected()});
    }
  };

  /**
   * Update the site class options in the select box based on
   * the location and edition.
   */
  _updateSiteClassCollectionSelectBox = function () {
    // TODO, get site class and reset _siteClassCollection
    var siteClasses = [];
    // siteClasses = FACTORY.getSiteClasses(lat,lon,edition); // or something
    _siteClassCollection.reset(siteClasses);
    // if selected model has vs30 set, update the CollectionSelectBox selected value
    if (_this.model) {
      _siteClassCollection.select(_this.model.get('vs30'));
    }
  };

  /**
   * set the selected site class after updating the values
   * in the siteClassCollectionSelectBox
   *
   * @return {[type]} [description]
   */
  _selectSiteClass = function () {
    // TODO, select site class in select box if defined
    if (_this.model) {
      _siteClassCollection.select(_this.model.get('vs30'));
    } else {
      // TODO, select B/C Boundary
    }
  };

  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {
    // unbind
    _siteClassCollection.off('select', _updateSiteClass);
    // methods
    _updateSiteClass = null;
    // variables
    _selectSiteClass = null;
    _siteClassCollection = null;
    _siteClassCollectionSelectBox = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);

  /**
   * unset the event bindings for the collection
   */
  _this.onCollectionDeselect = function () {
    // unbind to change on the model:latitude
    _this.model.off('change:latitude', _updateSiteClassCollectionSelectBox);
    // unbind to change on the model:longitude
    _this.model.off('change:longitude', _updateSiteClassCollectionSelectBox);
    // unbind to change on the model:edition
    _this.model.off('change:edition', _updateSiteClassCollectionSelectBox);
    _this.model = null;
    _this.render();
  };

  /**
   * set event bindings for the collection
   */
  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();
    // bind to change on the model:latitude
    _this.model.on('change:latitude', _updateSiteClassCollectionSelectBox);
    // bind to change on the model:longitude
    _this.model.on('change:longitude', _updateSiteClassCollectionSelectBox);
    // bind to change on the model:edition
    _this.model.on('change:edition', _updateSiteClassCollectionSelectBox);
    _this.render();
  };

  /**
   * render the selected site class, or the blank option
   */
  _this.render = function () {
    var siteClass;

    // Update selected edition when collection changes
    if (_this.model) {
      siteClass = _this.model.get('vs30');
      if (siteClass === null) {
        _siteClassCollection.deselect();
      } else {
        _siteClassCollection.select(siteClass);
      }
    } else {
      // no item in the collection has been selected
      _siteClassCollection.deselect();
    }
  };

  _initialize(params);
  params = null;
  return _this;

};

module.exports = SiteClassView;
