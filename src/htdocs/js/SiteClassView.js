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

      _siteClassCollection,

      _updateSiteClass;

  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function (params) {

    // editions CollectionSelectBox
    _siteClassCollection = params.vs30 || Collection();

    CollectionSelectBox({
      collection: _siteClassCollection,
      el: _this.el,
      includeBlankOption: true,
      format: function (model) {
        return model.get('display');
      }
    });

    // bind to select on the Edition collection
    _siteClassCollection.on('select', _updateSiteClass, _this);
    _siteClassCollection.on('deselect', _updateSiteClass, _this);

    // select the edition in the currently selected Analysis
    _this.render();
  };

    /**
     * update the currently selected Analysis model  with
     * the currently selected Edition in the CollectionSelectBox.
     */
  _updateSiteClass = function () {
    if (_this.model) {
      _this.model.set({'vs30': _siteClassCollection.getSelected()});
    }
  };

  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {
    // unbind
    _siteClassCollection.off('select', _updateSiteClass, _this);
    // methods
    _updateSiteClass = null;
    // variables
    _siteClassCollection = null;
    _this = null;
    _initialize = null;
  }, _this.destroy);

  /**
   * unset the event bindings for the collection
   */
  _this.onCollectionDeselect = function () {
    _this.model.off('change', _updateSiteClass, _this);
    _this.model = null;
    _this.render();
  };

  /**
   * set event bindings for the collection
   */
  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();
    _this.model.on('change', _updateSiteClass, _this);
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
