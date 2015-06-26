'use strict';

var CollectionSelectBox = require('mvc/CollectionSelectBox'),
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
      _siteClassCollectionSelectBox,

      _updateSiteClass;


  _this = SelectedCollectionView(params);

  /**
   * @constructor
   */
  _initialize = function (params) {
    _siteClassCollection = params.siteClasses;

    // site class CollectionSelectBox
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
  };


  /**
   * update the currently selected Analysis model with
   * the currently selected Site Class in the CollectionSelectBox.
   */
  _updateSiteClass = function () {
    var selected;

    if (_this.model) {
      selected = _siteClassCollection.getSelected();

      if (selected) {
        _this.model.set({'vs30': selected.get('id')});
      } else {
        _this.model.set({'vs30': null});
      }
    }
  };


  /**
   * Calls CollectionSelectBox.destroy() and cleans up local variables
   */
  _this.destroy = Util.compose(function () {
    // unbind
    _siteClassCollection.off('select', _updateSiteClass);
    _siteClassCollection.off('deselect', _updateSiteClass);

    // destroy
    _siteClassCollectionSelectBox.destroy();

    // methods
    _updateSiteClass = null;

    // variables
    _siteClassCollection = null;
    _siteClassCollectionSelectBox = null;

    _this = null;
    _initialize = null;
  }, _this.destroy);

  /**
   * Uses the site class from the currently selected model to select a site
   * class in the collection. This in-turn will update the CollectionSelectBox
   * rendering.
   *
   * This only happens if the changes include either:
   *  (a) vs30 : The site class changed or
   *  (b) model: The selected model changed
   *
   * If the currently selected model is null, the site class collection is
   * deselected.
   *
   * @param changes {Object}
   *      An object containing the keys of what changed on the model
   */
  _this.render = function (changes) {
    var siteClass;

    if (changes && (changes.vs30 || changes.model)) {
      if (_this.model) {
        siteClass = _this.model.get('vs30');

        if (siteClass !== null) {
          _siteClassCollection.selectById(siteClass);
        } else {
          _siteClassCollection.deselect();
        }
      } else {
        // no item in the collection has been selected
        _siteClassCollection.deselect();
      }
    }
  };


  _initialize(params);
  params = null;
  return _this;

};

module.exports = SiteClassView;
